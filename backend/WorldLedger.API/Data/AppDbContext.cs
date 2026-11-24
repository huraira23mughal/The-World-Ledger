using Microsoft.EntityFrameworkCore;
using WorldLedger.API.Entities;

namespace WorldLedger.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ArticleTag> ArticleTags => Set<ArticleTag>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
    public DbSet<Image> Images => Set<Image>();
    public DbSet<ArticleView> ArticleViews => Set<ArticleView>();
    public DbSet<OTPVerification> OTPVerifications => Set<OTPVerification>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<LiveNewsItem> LiveNewsItems => Set<LiveNewsItem>();
    public DbSet<PaymentRecord> PaymentRecords => Set<PaymentRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.PhoneNumber).IsUnique().HasFilter("[PhoneNumber] IS NOT NULL");
            entity.HasIndex(u => u.Username).IsUnique().HasFilter("[Username] IS NOT NULL");

            entity.HasOne(u => u.Role)
                  .WithMany(r => r.Users)
                  .HasForeignKey(u => u.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Role
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.HasIndex(r => r.Name).IsUnique();
        });

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        // Tag
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.HasIndex(t => t.Slug).IsUnique();
        });

        // Article
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => a.Slug).IsUnique();

            entity.Property(a => a.PublishingFee)
                  .HasPrecision(18, 2);

            entity.HasOne(a => a.Author)
                  .WithMany(u => u.Articles)
                  .HasForeignKey(a => a.AuthorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Category)
                  .WithMany(c => c.Articles)
                  .HasForeignKey(a => a.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ArticleTag (Composite Key)
        modelBuilder.Entity<ArticleTag>(entity =>
        {
            entity.HasKey(at => new { at.ArticleId, at.TagId });

            entity.HasOne(at => at.Article)
                  .WithMany(a => a.ArticleTags)
                  .HasForeignKey(at => at.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(at => at.Tag)
                  .WithMany(t => t.ArticleTags)
                  .HasForeignKey(at => at.TagId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.HasOne(c => c.Article)
                  .WithMany(a => a.Comments)
                  .HasForeignKey(c => c.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.User)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // Like (Unique per user + article)
        modelBuilder.Entity<Like>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.HasIndex(l => new { l.ArticleId, l.UserId }).IsUnique();

            entity.HasOne(l => l.Article)
                  .WithMany(a => a.Likes)
                  .HasForeignKey(l => l.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.User)
                  .WithMany(u => u.Likes)
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // Bookmark (Unique per user + article)
        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.HasIndex(b => new { b.ArticleId, b.UserId }).IsUnique();

            entity.HasOne(b => b.Article)
                  .WithMany(a => a.Bookmarks)
                  .HasForeignKey(b => b.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(b => b.User)
                  .WithMany(u => u.Bookmarks)
                  .HasForeignKey(b => b.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // Image
        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(i => i.Id);

            entity.HasOne(i => i.UploadedBy)
                  .WithMany(u => u.Images)
                  .HasForeignKey(i => i.UploadedById)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ArticleView
        modelBuilder.Entity<ArticleView>(entity =>
        {
            entity.HasKey(av => av.Id);

            entity.HasOne(av => av.Article)
                  .WithMany(a => a.Views)
                  .HasForeignKey(av => av.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(av => av.User)
                  .WithMany()
                  .HasForeignKey(av => av.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // OTPVerification
        modelBuilder.Entity<OTPVerification>(entity =>
        {
            entity.HasKey(otp => otp.Id);
            entity.HasIndex(otp => new { otp.Identifier, otp.Purpose, otp.IsUsed });
        });

        // RefreshToken
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(rt => rt.Id);
            entity.HasIndex(rt => rt.Token).IsUnique();

            entity.HasOne(rt => rt.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // LiveNewsItem
        modelBuilder.Entity<LiveNewsItem>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.HasIndex(n => n.CreatedAt);
            entity.HasIndex(n => new { n.Category, n.IsLive });
            entity.HasIndex(n => n.IsBreaking);
        });

        // PaymentRecord
        modelBuilder.Entity<PaymentRecord>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasIndex(p => p.TransactionId).IsUnique();

            entity.Property(p => p.Amount)
                  .HasPrecision(18, 2);

            entity.HasOne(p => p.User)
                  .WithMany()
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(p => p.Article)
                  .WithMany()
                  .HasForeignKey(p => p.ArticleId)
                  .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
