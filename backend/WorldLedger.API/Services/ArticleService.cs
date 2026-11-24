using System.Text.RegularExpressions;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IArticleService
{
    Task<ArticleListDto> GetPublishedArticlesAsync(string? categorySlug = null, string? tagSlug = null, string? searchQuery = null, int page = 1, int pageSize = 12, Guid? currentUserId = null);
    Task<ArticleDto?> GetBySlugAsync(string slug, string? ipAddress = null, Guid? currentUserId = null);
    Task<ArticleDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<List<ArticleDto>> GetFeaturedArticlesAsync();
    Task<List<ArticleDto>> GetMostPopularArticlesAsync();
    Task<List<ArticleDto>> GetAuthorArticlesAsync(Guid authorId, bool publishedOnly = true);
    Task<ArticleDto> CreateArticleAsync(Guid authorId, CreateArticleDto dto);
    Task<ArticleDto?> UpdateArticleAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateArticleDto dto);
    Task<ArticleDto?> ProcessPublishPaymentAsync(Guid articleId, Guid currentUserId, PublishArticlePaymentDto dto);
    Task<bool> DeleteArticleAsync(Guid id, Guid currentUserId, bool isAdmin);
    Task<bool> ChangeStatusAsync(Guid id, ArticleStatus status);
}

public class ArticleService : IArticleService
{
    private readonly IUnitOfWork _unitOfWork;

    public ArticleService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ArticleListDto> GetPublishedArticlesAsync(
        string? categorySlug = null,
        string? tagSlug = null,
        string? searchQuery = null,
        int page = 1,
        int pageSize = 12,
        Guid? currentUserId = null)
    {
        var (articles, total) = await _unitOfWork.Articles.GetPublishedArticlesAsync(
            categorySlug, tagSlug, searchQuery, page, pageSize);

        User? viewer = currentUserId.HasValue ? await _unitOfWork.Users.GetByIdAsync(currentUserId.Value) : null;
        var dtos = articles.Select(a => MapToDto(a, currentUserId, viewer)).ToList();

        return new ArticleListDto
        {
            Articles = dtos,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ArticleDto?> GetBySlugAsync(string slug, string? ipAddress = null, Guid? currentUserId = null)
    {
        var article = await _unitOfWork.Articles.GetBySlugWithDetailsAsync(slug);
        if (article == null) return null;

        // Increment views asynchronously
        _ = _unitOfWork.Articles.IncrementViewsAsync(article.Id, ipAddress, currentUserId);

        User? viewer = currentUserId.HasValue ? await _unitOfWork.Users.GetByIdAsync(currentUserId.Value) : null;
        return MapToDto(article, currentUserId, viewer);
    }

    public async Task<ArticleDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var article = await _unitOfWork.Articles.GetByIdWithDetailsAsync(id);
        if (article == null) return null;
        User? viewer = currentUserId.HasValue ? await _unitOfWork.Users.GetByIdAsync(currentUserId.Value) : null;
        return MapToDto(article, currentUserId, viewer);
    }

    public async Task<List<ArticleDto>> GetFeaturedArticlesAsync()
    {
        var articles = await _unitOfWork.Articles.GetFeaturedArticlesAsync(6);
        return articles.Select(a => MapToDto(a)).ToList();
    }

    public async Task<List<ArticleDto>> GetMostPopularArticlesAsync()
    {
        var articles = await _unitOfWork.Articles.GetMostPopularArticlesAsync(5);
        return articles.Select(a => MapToDto(a)).ToList();
    }

    public async Task<List<ArticleDto>> GetAuthorArticlesAsync(Guid authorId, bool publishedOnly = true)
    {
        var articles = await _unitOfWork.Articles.GetArticlesByAuthorAsync(authorId, publishedOnly);
        return articles.Select(a => MapToDto(a)).ToList();
    }

    public async Task<ArticleDto> CreateArticleAsync(Guid authorId, CreateArticleDto dto)
    {
        var baseSlug = GenerateSlug(dto.Title);
        var slug = baseSlug;
        var counter = 1;
        while (await _unitOfWork.Articles.ExistsAsync(a => a.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var author = await _unitOfWork.Users.GetByIdAsync(authorId);
        var isAdmin = author?.RoleId == 1;
        var hasActiveAuthorSubscription = author != null && author.IsSubscribed &&
            string.Equals(author.SubscriptionPlan, "Author", StringComparison.OrdinalIgnoreCase);

        // Payment rule: If author has an active author subscription or is admin, fee is covered
        bool isDirectlyPublished = !dto.IsDraft && (isAdmin || hasActiveAuthorSubscription);

        var article = new Article
        {
            Title = dto.Title.Trim(),
            Slug = slug,
            Summary = dto.Summary.Trim(),
            Content = dto.Content,
            CategoryId = dto.CategoryId,
            AuthorId = authorId,
            FeaturedImageUrl = dto.FeaturedImageUrl,
            ImageCaption = dto.ImageCaption,
            Kicker = dto.Kicker,
            ReadTime = string.IsNullOrWhiteSpace(dto.ReadTime) ? CalculateReadTime(dto.Content) : dto.ReadTime,
            Status = isDirectlyPublished ? ArticleStatus.Published : ArticleStatus.Draft,
            PublishedAt = isDirectlyPublished ? DateTime.UtcNow : null,
            IsPremium = dto.IsPremium,
            IsPaid = isDirectlyPublished,
            PublishingFee = 25.00m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Articles.AddAsync(article);
        await _unitOfWork.CompleteAsync();

        // Process tags
        if (dto.TagNames != null && dto.TagNames.Any())
        {
            foreach (var tagName in dto.TagNames.Distinct())
            {
                var cleanName = tagName.Trim();
                if (string.IsNullOrWhiteSpace(cleanName)) continue;

                var tagSlug = GenerateSlug(cleanName);
                var tag = await _unitOfWork.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
                if (tag == null)
                {
                    tag = new Tag { Name = cleanName, Slug = tagSlug };
                    await _unitOfWork.Tags.AddAsync(tag);
                    await _unitOfWork.CompleteAsync();
                }

                await _unitOfWork.ArticleTags.AddAsync(new ArticleTag { ArticleId = article.Id, TagId = tag.Id });
            }
            await _unitOfWork.CompleteAsync();
        }

        var fullArticle = await _unitOfWork.Articles.GetByIdWithDetailsAsync(article.Id);
        return MapToDto(fullArticle!, authorId, author);
    }

    public async Task<ArticleDto?> ProcessPublishPaymentAsync(Guid articleId, Guid currentUserId, PublishArticlePaymentDto dto)
    {
        var article = await _unitOfWork.Articles.GetByIdWithDetailsAsync(articleId);
        if (article == null) return null;

        var user = await _unitOfWork.Users.GetByIdAsync(currentUserId);
        if (article.AuthorId != currentUserId && user?.RoleId != 1)
        {
            throw new UnauthorizedAccessException("You are not authorized to publish this article.");
        }

        // Record payment
        var txnId = $"TXN-PUB-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
        var payment = new PaymentRecord
        {
            UserId = currentUserId,
            ArticleId = articleId,
            Amount = dto.Amount > 0 ? dto.Amount : 25.00m,
            Currency = "USD",
            PaymentType = "ArticlePublishing",
            PlanOrTier = article.IsPremium ? "Premium Publishing Pass" : "Standard Publishing Pass",
            TransactionId = txnId,
            Status = "Completed",
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.PaymentRecords.AddAsync(payment);

        article.IsPaid = true;
        article.Status = ArticleStatus.Published;
        article.PublishedAt = DateTime.UtcNow;
        article.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Articles.Update(article);
        await _unitOfWork.CompleteAsync();

        return MapToDto(article, currentUserId, user);
    }

    public async Task<ArticleDto?> UpdateArticleAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateArticleDto dto)
    {
        var article = await _unitOfWork.Articles.GetByIdWithDetailsAsync(id);
        if (article == null) return null;

        if (article.AuthorId != currentUserId && !isAdmin)
        {
            throw new UnauthorizedAccessException("You are not authorized to edit this article.");
        }

        if (dto.Title != null) article.Title = dto.Title.Trim();
        if (dto.Summary != null) article.Summary = dto.Summary.Trim();
        if (dto.Content != null)
        {
            article.Content = dto.Content;
            article.ReadTime = CalculateReadTime(dto.Content);
        }
        if (dto.CategoryId.HasValue) article.CategoryId = dto.CategoryId.Value;
        if (dto.FeaturedImageUrl != null) article.FeaturedImageUrl = dto.FeaturedImageUrl;
        if (dto.ImageCaption != null) article.ImageCaption = dto.ImageCaption;
        if (dto.Kicker != null) article.Kicker = dto.Kicker;
        if (dto.IsPremium.HasValue) article.IsPremium = dto.IsPremium.Value;

        if (dto.IsDraft.HasValue)
        {
            article.Status = dto.IsDraft.Value ? ArticleStatus.Draft : ArticleStatus.Published;
            if (article.Status == ArticleStatus.Published && article.PublishedAt == null)
            {
                article.PublishedAt = DateTime.UtcNow;
            }
        }

        article.UpdatedAt = DateTime.UtcNow;

        // Tags update if provided
        if (dto.TagNames != null)
        {
            var currentTags = await _unitOfWork.ArticleTags.FindAsync(at => at.ArticleId == article.Id);
            foreach (var ct in currentTags)
            {
                _unitOfWork.ArticleTags.Remove(ct);
            }

            foreach (var tagName in dto.TagNames.Distinct())
            {
                var cleanName = tagName.Trim();
                if (string.IsNullOrWhiteSpace(cleanName)) continue;

                var tagSlug = GenerateSlug(cleanName);
                var tag = await _unitOfWork.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
                if (tag == null)
                {
                    tag = new Tag { Name = cleanName, Slug = tagSlug };
                    await _unitOfWork.Tags.AddAsync(tag);
                    await _unitOfWork.CompleteAsync();
                }

                await _unitOfWork.ArticleTags.AddAsync(new ArticleTag { ArticleId = article.Id, TagId = tag.Id });
            }
        }

        _unitOfWork.Articles.Update(article);
        await _unitOfWork.CompleteAsync();

        var user = await _unitOfWork.Users.GetByIdAsync(currentUserId);
        var reloaded = await _unitOfWork.Articles.GetByIdWithDetailsAsync(article.Id);
        return MapToDto(reloaded!, currentUserId, user);
    }

    public async Task<bool> DeleteArticleAsync(Guid id, Guid currentUserId, bool isAdmin)
    {
        var article = await _unitOfWork.Articles.GetByIdAsync(id);
        if (article == null) return false;

        if (article.AuthorId != currentUserId && !isAdmin)
        {
            throw new UnauthorizedAccessException("You are not authorized to delete this article.");
        }

        _unitOfWork.Articles.Remove(article);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    public async Task<bool> ChangeStatusAsync(Guid id, ArticleStatus status)
    {
        var article = await _unitOfWork.Articles.GetByIdAsync(id);
        if (article == null) return false;

        article.Status = status;
        if (status == ArticleStatus.Published && article.PublishedAt == null)
        {
            article.PublishedAt = DateTime.UtcNow;
        }
        article.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Articles.Update(article);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    private static ArticleDto MapToDto(Article a, Guid? currentUserId = null, User? viewer = null)
    {
        var isAuthor = currentUserId.HasValue && a.AuthorId == currentUserId.Value;
        var isAdmin = viewer != null && viewer.RoleId == 1;
        var isSubscribed = viewer != null && viewer.IsSubscribed && (viewer.SubscriptionExpiresAt == null || viewer.SubscriptionExpiresAt > DateTime.UtcNow);

        var canViewFullContent = !a.IsPremium || isAuthor || isAdmin || isSubscribed;
        var isPaywalled = a.IsPremium && !canViewFullContent;

        var displayContent = a.Content;
        if (isPaywalled)
        {
            displayContent = TruncateTeaser(a.Content, a.Summary);
        }

        return new ArticleDto
        {
            Id = a.Id,
            Title = a.Title,
            Slug = a.Slug,
            Summary = a.Summary,
            Content = displayContent,
            FeaturedImageUrl = a.FeaturedImageUrl,
            ImageCaption = a.ImageCaption,
            Kicker = a.Kicker,
            ReadTime = a.ReadTime,
            Status = a.Status.ToString(),
            IsFeatured = a.IsFeatured,
            IsPremium = a.IsPremium,
            IsPaid = a.IsPaid,
            IsPaywalled = isPaywalled,
            PublishedAt = a.PublishedAt,
            CreatedAt = a.CreatedAt,
            TimeAgo = ToTimeAgo(a.PublishedAt ?? a.CreatedAt),
            ViewsCount = a.ViewsCount,
            LikesCount = a.Likes?.Count ?? a.LikesCount,
            CommentsCount = a.Comments?.Count ?? 0,
            IsLikedByCurrentUser = currentUserId.HasValue && a.Likes != null && a.Likes.Any(l => l.UserId == currentUserId.Value),
            IsBookmarkedByCurrentUser = currentUserId.HasValue && a.Bookmarks != null && a.Bookmarks.Any(b => b.UserId == currentUserId.Value),
            Author = new AuthorSummaryDto
            {
                Id = a.Author?.Id ?? Guid.Empty,
                Name = a.Author?.FullName ?? "Staff Correspondent",
                Username = a.Author?.Username ?? "author",
                AvatarUrl = a.Author?.AvatarUrl,
                Bio = a.Author?.Bio
            },
            Category = new CategorySummaryDto
            {
                Id = a.Category?.Id ?? Guid.Empty,
                Name = a.Category?.Name ?? "General",
                Slug = a.Category?.Slug ?? "general",
                PillarColor = a.Category?.PillarColor ?? "#052962",
                AccentColor = a.Category?.AccentColor ?? "#005689"
            },
            Tags = a.ArticleTags?.Select(at => new TagDto
            {
                Id = at.Tag.Id,
                Name = at.Tag.Name,
                Slug = at.Tag.Slug
            }).ToList() ?? new List<TagDto>(),
            Comments = a.Comments?.Select(c => new CommentDto
            {
                Id = c.Id,
                ArticleId = c.ArticleId,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                TimeAgo = ToTimeAgo(c.CreatedAt),
                User = new UserDto
                {
                    Id = c.User.Id,
                    FullName = c.User.FullName,
                    Email = c.User.Email,
                    AvatarUrl = c.User.AvatarUrl,
                    Role = c.User.Role?.Name ?? "Reader"
                }
            }).ToList() ?? new List<CommentDto>()
        };
    }

    private static string TruncateTeaser(string content, string summary)
    {
        if (string.IsNullOrWhiteSpace(content)) return summary;
        var pEnd = content.IndexOf("</p>", StringComparison.OrdinalIgnoreCase);
        if (pEnd > 0)
        {
            return content.Substring(0, pEnd + 4);
        }
        return content.Length > 350 ? content[..350] + "..." : content;
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLower().Trim();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-").Trim('-');
        return slug.Length > 80 ? slug[..80] : slug;
    }

    private static string CalculateReadTime(string content)
    {
        var wordCount = Regex.Matches(content, @"\b\w+\b").Count;
        var minutes = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));
        return $"{minutes} min read";
    }

    private static string ToTimeAgo(DateTime dt)
    {
        var diff = DateTime.UtcNow - dt;
        if (diff.TotalMinutes < 1) return "Just now";
        if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes}m ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours}h ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays}d ago";
        return dt.ToString("d MMM yyyy");
    }
}
