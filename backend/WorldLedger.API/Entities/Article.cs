namespace WorldLedger.API.Entities;

public enum ArticleStatus
{
    Draft = 0,
    Published = 1,
    Archived = 2
}

public class Article
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Rich HTML or markdown
    public string? FeaturedImageUrl { get; set; }
    public string? ImageCaption { get; set; }
    public string? Kicker { get; set; }
    public string ReadTime { get; set; } = "5 min read";

    public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
    public bool IsFeatured { get; set; } = false;

    // Premium & Author Payment Workflow
    public bool IsPremium { get; set; } = false; // Free vs Premium
    public bool IsPaid { get; set; } = false;    // Paid publishing fee
    public decimal PublishingFee { get; set; } = 25.00m;

    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int ViewsCount { get; set; } = 0;
    public int LikesCount { get; set; } = 0;

    public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
    public ICollection<ArticleView> Views { get; set; } = new List<ArticleView>();
}
