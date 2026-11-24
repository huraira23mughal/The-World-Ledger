namespace WorldLedger.API.Entities;

public class LiveNewsItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Source { get; set; } = "The World Ledger Newsroom";
    
    // Category tabs: World, Pakistan, Business, Sports, Technology
    public string Category { get; set; } = "World";
    
    public bool IsBreaking { get; set; } = false;
    public bool IsLive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

