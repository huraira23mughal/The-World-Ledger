namespace WorldLedger.API.Entities;

public class OTPVerification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Identifier { get; set; } = string.Empty; // Email or Phone Number
    public string OtpCode { get; set; } = string.Empty;
    public string Purpose { get; set; } = "Signup"; // "Signup", "Login", "PasswordReset"
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public int AttemptsCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

