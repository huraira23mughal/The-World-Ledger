namespace WorldLedger.API.Entities;

public class ArticleView
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ArticleId { get; set; }
    public Article Article { get; set; } = null!;

    public string? IpAddress { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}

