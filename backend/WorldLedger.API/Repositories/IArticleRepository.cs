using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public interface IArticleRepository : IRepository<Article>
{
    Task<(IEnumerable<Article> Articles, int TotalCount)> GetPublishedArticlesAsync(
        string? categorySlug = null,
        string? tagSlug = null,
        string? searchQuery = null,
        int page = 1,
        int pageSize = 12);

    Task<Article?> GetBySlugWithDetailsAsync(string slug);
    Task<Article?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<Article>> GetFeaturedArticlesAsync(int count = 5);
    Task<IEnumerable<Article>> GetMostPopularArticlesAsync(int count = 5);
    Task<IEnumerable<Article>> GetArticlesByAuthorAsync(Guid authorId, bool publishedOnly = true);
    Task IncrementViewsAsync(Guid articleId, string? ipAddress, Guid? userId);
}

