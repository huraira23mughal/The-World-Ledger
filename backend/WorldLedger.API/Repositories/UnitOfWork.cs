using WorldLedger.API.Data;
using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IUserRepository Users { get; }
    public IArticleRepository Articles { get; }
    public IRepository<Category> Categories { get; }
    public IRepository<Tag> Tags { get; }
    public IRepository<ArticleTag> ArticleTags { get; }
    public IRepository<Comment> Comments { get; }
    public IRepository<Like> Likes { get; }
    public IRepository<Bookmark> Bookmarks { get; }
    public IRepository<Image> Images { get; }
    public IRepository<Role> Roles { get; }
    public IOTPRepository OTPs { get; }
    public IRepository<RefreshToken> RefreshTokens { get; }
    public IRepository<LiveNewsItem> LiveNews { get; }
    public IRepository<PaymentRecord> PaymentRecords { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new UserRepository(context);
        Articles = new ArticleRepository(context);
        Categories = new Repository<Category>(context);
        Tags = new Repository<Tag>(context);
        ArticleTags = new Repository<ArticleTag>(context);
        Comments = new Repository<Comment>(context);
        Likes = new Repository<Like>(context);
        Bookmarks = new Repository<Bookmark>(context);
        Images = new Repository<Image>(context);
        Roles = new Repository<Role>(context);
        OTPs = new OTPRepository(context);
        RefreshTokens = new Repository<RefreshToken>(context);
        LiveNews = new Repository<LiveNewsItem>(context);
        PaymentRecords = new Repository<PaymentRecord>(context);
    }

    public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}

