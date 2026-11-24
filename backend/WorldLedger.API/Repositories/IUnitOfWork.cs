using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IArticleRepository Articles { get; }
    IRepository<Category> Categories { get; }
    IRepository<Tag> Tags { get; }
    IRepository<ArticleTag> ArticleTags { get; }
    IRepository<Comment> Comments { get; }
    IRepository<Like> Likes { get; }
    IRepository<Bookmark> Bookmarks { get; }
    IRepository<Image> Images { get; }
    IRepository<Role> Roles { get; }
    IOTPRepository OTPs { get; }
    IRepository<RefreshToken> RefreshTokens { get; }
    IRepository<LiveNewsItem> LiveNews { get; }
    IRepository<PaymentRecord> PaymentRecords { get; }

    Task<int> CompleteAsync();
}

