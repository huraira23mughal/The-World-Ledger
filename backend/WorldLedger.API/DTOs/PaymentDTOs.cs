using System.ComponentModel.DataAnnotations;

namespace WorldLedger.API.DTOs;

public class ProcessPaymentDto
{
    [Required]
    [Range(1, 10000)]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    [Required]
    public string PlanOrTier { get; set; } = "Supporter"; // Supporter, Partner, Patron, Digital All-Access, Print & Digital

    public string Frequency { get; set; } = "Monthly"; // One-Time, Monthly, Annual

    public string PaymentMethod { get; set; } = "credit_card"; // credit_card, paypal, apple_pay, google_pay

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? CardNumberLast4 { get; set; }
}

public class PaymentReceiptDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string PlanOrTier { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; }
    public string Status { get; set; } = "Completed";
}

