namespace WorldLedger.API.Entities;

public class PaymentRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public Guid? ArticleId { get; set; }
    public Article? Article { get; set; }
    
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    
    // "Subscription", "ArticlePublishing"
    public string PaymentType { get; set; } = "Subscription";
    public string PlanOrTier { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed"; // "Completed", "Pending", "Failed"
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

