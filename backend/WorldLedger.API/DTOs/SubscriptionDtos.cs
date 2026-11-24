using System.ComponentModel.DataAnnotations;

namespace WorldLedger.API.DTOs;

public class SubscribeRequestDto
{
    [Required]
    public string Plan { get; set; } = "Reader"; // "Reader" ($5/mo), "Author" ($49/mo)
    public string PaymentMethod { get; set; } = "card";
    public string? CardNumber { get; set; }
}

public class PublishArticlePaymentDto
{
    [Required]
    public Guid ArticleId { get; set; }
    public decimal Amount { get; set; } = 25.00m;
    public string PaymentMethod { get; set; } = "card";
    public string? CardNumber { get; set; }
}

public class SubscriptionStatusDto
{
    public bool IsSubscribed { get; set; }
    public string? Plan { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool CanAccessPremium { get; set; }
}

