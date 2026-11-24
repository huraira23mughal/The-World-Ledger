using System.ComponentModel.DataAnnotations;

namespace WorldLedger.API.DTOs;

public class SignupDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string EmailOrPhone { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = "Reader"; // "Author" or "Reader"
}

public class LoginDto
{
    [Required]
    public string EmailOrPhone { get; set; } = string.Empty;

    public string? Password { get; set; } // If password login

    public string? OtpCode { get; set; } // If OTP login
}

public class SendOtpDto
{
    [Required]
    public string Identifier { get; set; } = string.Empty; // Email or Phone

    public string Purpose { get; set; } = "Login"; // "Signup", "Login", "PasswordReset"
}

public class VerifyOtpDto
{
    [Required]
    public string Identifier { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;

    public string Purpose { get; set; } = "Login";
}

public class ForgotPasswordDto
{
    [Required]
    public string Identifier { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    [Required]
    public string Identifier { get; set; } = string.Empty;

    [Required]
    public string OtpCode { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? Username { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool IsActive { get; set; }
    public bool IsSubscribed { get; set; }
    public DateTime? SubscriptionExpiresAt { get; set; }
    public string? SubscriptionPlan { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuthResponseDto
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public UserDto? User { get; set; }
    public bool RequiresOtp { get; set; } = false;
    public string? OtpDestination { get; set; }
}

