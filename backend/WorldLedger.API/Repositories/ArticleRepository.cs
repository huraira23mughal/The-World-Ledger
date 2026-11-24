using Microsoft.EntityFrameworkCore;
using WorldLedger.API.Data;
using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public class ArticleRepository : Repository<Article>, IArticleRepository
{
    public ArticleRepository(AppDbContext context) : base(context) { }

    public async Task<(IEnumerable<Article> Articles, int TotalCount)> GetPublishedArticlesAsync(
        string? categorySlug = null,
        string? tagSlug = null,
        string? searchQuery = null,
        int page = 1,
        int pageSize = 12)
    {
        var query = _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .Where(a => a.Status == ArticleStatus.Published)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(categorySlug) && categorySlug.ToLower() != "all")
        {
            query = query.Where(a => a.Category.Slug.ToLower() == categorySlug.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(tagSlug))
        {
            query = query.Where(a => a.ArticleTags.Any(at => at.Tag.Slug.ToLower() == tagSlug.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var search = searchQuery.ToLower().Trim();
            query = query.Where(a =>
                a.Title.ToLower().Contains(search) ||
                a.Summary.ToLower().Contains(search) ||
                a.Content.ToLower().Contains(search) ||
                a.Author.FullName.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var articles = await query
            .OrderByDescending(a => a.PublishedAt ?? a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (articles, total);
    }

    public async Task<Article?> GetBySlugWithDetailsAsync(string slug)
    {
        return await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .Include(a => a.Comments.OrderByDescending(c => c.CreatedAt))
                .ThenInclude(c => c.User)
            .Include(a => a.Likes)
            .Include(a => a.Bookmarks)
            .FirstOrDefaultAsync(a => a.Slug.ToLower() == slug.ToLower());
    }

    public async Task<Article?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .Include(a => a.Comments)
                .ThenInclude(c => c.User)
            .Include(a => a.Likes)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Article>> GetFeaturedArticlesAsync(int count = 5)
    {
        return await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Where(a => a.Status == ArticleStatus.Published && a.IsFeatured)
            .OrderByDescending(a => a.PublishedAt ?? a.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Article>> GetMostPopularArticlesAsync(int count = 5)
    {
        return await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Where(a => a.Status == ArticleStatus.Published)
            .OrderByDescending(a => a.ViewsCount)
            .ThenByDescending(a => a.LikesCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Article>> GetArticlesByAuthorAsync(Guid authorId, bool publishedOnly = true)
    {
        var query = _context.Articles
            .Include(a => a.Category)
            .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
            .Where(a => a.AuthorId == authorId);

        if (publishedOnly)
        {
            query = query.Where(a => a.Status == ArticleStatus.Published);
        }

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task IncrementViewsAsync(Guid articleId, string? ipAddress, Guid? userId)
    {
        var article = await _context.Articles.FindAsync(articleId);
        if (article != null)
        {
            article.ViewsCount++;
            var view = new ArticleView
            {
                ArticleId = articleId,
                IpAddress = ipAddress,
                UserId = userId,
                ViewedAt = DateTime.UtcNow
            };
            await _context.ArticleViews.AddAsync(view);
            await _context.SaveChangesAsync();
        }
    }
}

