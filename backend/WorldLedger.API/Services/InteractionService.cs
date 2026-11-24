using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IInteractionService
{
    Task<(bool IsLiked, int LikesCount)> ToggleLikeAsync(Guid articleId, Guid userId);
    Task<bool> ToggleBookmarkAsync(Guid articleId, Guid userId);
    Task<List<ArticleDto>> GetUserBookmarksAsync(Guid userId, int page = 1, int pageSize = 12);
    Task<(bool IsLiked, bool IsBookmarked)> GetStatusAsync(Guid articleId, Guid? userId);
}

public class InteractionService : IInteractionService
{
    private readonly IUnitOfWork _unitOfWork;

    public InteractionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<(bool IsLiked, int LikesCount)> ToggleLikeAsync(Guid articleId, Guid userId)
    {
        var article = await _unitOfWork.Articles.GetByIdAsync(articleId);
        if (article == null)
            throw new ArgumentException("Article not found.");

        var existing = await _unitOfWork.Likes.FirstOrDefaultAsync(l => l.ArticleId == articleId && l.UserId == userId);
        bool isLiked;

        if (existing != null)
        {
            _unitOfWork.Likes.Remove(existing);
            article.LikesCount = Math.Max(0, article.LikesCount - 1);
            isLiked = false;
        }
        else
        {
            await _unitOfWork.Likes.AddAsync(new Like
            {
                ArticleId = articleId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
            article.LikesCount += 1;
            isLiked = true;
        }

        _unitOfWork.Articles.Update(article);
        await _unitOfWork.CompleteAsync();

        return (isLiked, article.LikesCount);
    }

    public async Task<bool> ToggleBookmarkAsync(Guid articleId, Guid userId)
    {
        var article = await _unitOfWork.Articles.GetByIdAsync(articleId);
        if (article == null)
            throw new ArgumentException("Article not found.");

        var existing = await _unitOfWork.Bookmarks.FirstOrDefaultAsync(b => b.ArticleId == articleId && b.UserId == userId);
        bool isBookmarked;

        if (existing != null)
        {
            _unitOfWork.Bookmarks.Remove(existing);
            isBookmarked = false;
        }
        else
        {
            await _unitOfWork.Bookmarks.AddAsync(new Bookmark
            {
                ArticleId = articleId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
            isBookmarked = true;
        }

        await _unitOfWork.CompleteAsync();
        return isBookmarked;
    }

    public async Task<List<ArticleDto>> GetUserBookmarksAsync(Guid userId, int page = 1, int pageSize = 12)
    {
        var bookmarks = await _unitOfWork.Bookmarks.Query()
            .Where(b => b.UserId == userId)
            .Include(b => b.Article)
                .ThenInclude(a => a.Author)
            .Include(b => b.Article)
                .ThenInclude(a => a.Category)
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => b.Article)
            .ToListAsync();

        return bookmarks.Select(a => new ArticleDto
        {
            Id = a.Id,
            Title = a.Title,
            Slug = a.Slug,
            Summary = a.Summary,
            FeaturedImageUrl = a.FeaturedImageUrl,
            ImageCaption = a.ImageCaption,
            Kicker = a.Kicker,
            ReadTime = a.ReadTime,
            Status = a.Status.ToString(),
            IsFeatured = a.IsFeatured,
            PublishedAt = a.PublishedAt,
            CreatedAt = a.CreatedAt,
            ViewsCount = a.ViewsCount,
            LikesCount = a.LikesCount,
            IsBookmarkedByCurrentUser = true,
            Author = new AuthorSummaryDto
            {
                Id = a.Author.Id,
                Name = a.Author.FullName,
                Username = a.Author.Username,
                AvatarUrl = a.Author.AvatarUrl,
                Bio = a.Author.Bio
            },
            Category = new CategorySummaryDto
            {
                Id = a.Category.Id,
                Name = a.Category.Name,
                Slug = a.Category.Slug,
                PillarColor = a.Category.PillarColor,
                AccentColor = a.Category.AccentColor
            }
        }).ToList();
    }

    public async Task<(bool IsLiked, bool IsBookmarked)> GetStatusAsync(Guid articleId, Guid? userId)
    {
        if (userId == null) return (false, false);

        var isLiked = await _unitOfWork.Likes.ExistsAsync(l => l.ArticleId == articleId && l.UserId == userId.Value);
        var isBookmarked = await _unitOfWork.Bookmarks.ExistsAsync(b => b.ArticleId == articleId && b.UserId == userId.Value);

        return (isLiked, isBookmarked);
    }
}

