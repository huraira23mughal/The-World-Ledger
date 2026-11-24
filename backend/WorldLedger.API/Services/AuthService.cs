using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> SignupAsync(SignupDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<(bool Success, string Message, string? Code)> SendOtpAsync(SendOtpDto dto);
    Task<AuthResponseDto> VerifyOtpAndLoginAsync(VerifyOtpDto dto);
    Task<(bool Success, string Message, string? Code)> ForgotPasswordAsync(ForgotPasswordDto dto);
    Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<UserDto?> GetUserByIdAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IOTPService _otpService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService, IOTPService otpService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _otpService = otpService;
    }

    public async Task<AuthResponseDto> SignupAsync(SignupDto dto)
    {
        var isEmail = dto.EmailOrPhone.Contains('@');
        var email = isEmail ? dto.EmailOrPhone.Trim().ToLower() : $"{dto.EmailOrPhone.Trim().Replace("+", "")}@user.theworldledger.com";
        var phone = !isEmail ? dto.EmailOrPhone.Trim() : null;

        // Check uniqueness
        var existing = await _unitOfWork.Users.GetByEmailOrPhoneAsync(dto.EmailOrPhone);
        if (existing != null)
        {
            return new AuthResponseDto { Success = false, Message = "An account with this email or phone number already exists." };
        }

        // Determine Role
        var roleName = dto.Role.Equals("Author", StringComparison.OrdinalIgnoreCase) ? "Author" : "Reader";
        var role = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
        var roleId = role?.Id ?? 3; // 3 = Reader

        // Generate clean username slug
        var baseSlug = dto.FullName.ToLower().Trim()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace(".", "");
        var username = $"{baseSlug}-{Random.Shared.Next(100, 999)}";

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            PhoneNumber = phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = roleId,
            Username = username,
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80",
            Bio = roleName == "Author" ? "Independent contributing writer at The World Ledger." : "Reader and global affairs subscriber.",
            IsEmailVerified = isEmail,
            IsPhoneVerified = !isEmail,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        // Reload with Role
        var createdUser = await _unitOfWork.Users.GetByIdWithRoleAsync(user.Id);

        // Generate Tokens
        var accessToken = _jwtService.GenerateAccessToken(createdUser!);
        var refreshToken = _jwtService.GenerateRefreshToken();

        await _unitOfWork.RefreshTokens.AddAsync(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(14)
        });
        await _unitOfWork.CompleteAsync();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Account created successfully.",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapUserToDto(createdUser!)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _unitOfWork.Users.GetByEmailOrPhoneAsync(dto.EmailOrPhone);
        if (user == null)
        {
            return new AuthResponseDto { Success = false, Message = "Invalid credentials or account does not exist." };
        }

        if (!user.IsActive)
        {
            return new AuthResponseDto { Success = false, Message = "Your account has been deactivated. Please contact editorial support." };
        }

        // Case 1: Logging in with OTP
        if (!string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            var verifyResult = await _otpService.VerifyOtpAsync(dto.EmailOrPhone, dto.OtpCode, "Login");
            if (!verifyResult.Success)
            {
                return new AuthResponseDto { Success = false, Message = verifyResult.Message };
            }
        }
        // Case 2: Logging in with password
        else if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return new AuthResponseDto { Success = false, Message = "Invalid credentials." };
            }
        }
        else
        {
            // Neither OTP nor password provided -> trigger OTP dispatch
            var otpSend = await _otpService.GenerateAndSendOtpAsync(dto.EmailOrPhone, "Login");
            return new AuthResponseDto
            {
                Success = otpSend.Success,
                Message = otpSend.Message,
                RequiresOtp = true,
                OtpDestination = dto.EmailOrPhone
            };
        }

        // Issue tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        await _unitOfWork.RefreshTokens.AddAsync(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(14)
        });
        await _unitOfWork.CompleteAsync();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Signed in successfully.",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapUserToDto(user)
        };
    }

    public async Task<(bool Success, string Message, string? Code)> SendOtpAsync(SendOtpDto dto)
    {
        return await _otpService.GenerateAndSendOtpAsync(dto.Identifier, dto.Purpose);
    }

    public async Task<AuthResponseDto> VerifyOtpAndLoginAsync(VerifyOtpDto dto)
    {
        var verifyResult = await _otpService.VerifyOtpAsync(dto.Identifier, dto.Code, dto.Purpose);
        if (!verifyResult.Success)
        {
            return new AuthResponseDto { Success = false, Message = verifyResult.Message };
        }

        var user = await _unitOfWork.Users.GetByEmailOrPhoneAsync(dto.Identifier);
        if (user == null)
        {
            return new AuthResponseDto { Success = false, Message = "User account not found for this identifier." };
        }

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        await _unitOfWork.RefreshTokens.AddAsync(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(14)
        });
        await _unitOfWork.CompleteAsync();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Verification successful.",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapUserToDto(user)
        };
    }

    public async Task<(bool Success, string Message, string? Code)> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _unitOfWork.Users.GetByEmailOrPhoneAsync(dto.Identifier);
        if (user == null)
        {
            // Return true for privacy protection against user enumeration
            return (true, "If an account matches that identifier, password reset instructions have been dispatched.", null);
        }

        return await _otpService.GenerateAndSendOtpAsync(dto.Identifier, "PasswordReset");
    }

    public async Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var verify = await _otpService.VerifyOtpAsync(dto.Identifier, dto.OtpCode, "PasswordReset");
        if (!verify.Success)
        {
            return (false, verify.Message);
        }

        var user = await _unitOfWork.Users.GetByEmailOrPhoneAsync(dto.Identifier);
        if (user == null)
        {
            return (false, "User account not found.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        return (true, "Password has been successfully updated. You may now sign in.");
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var stored = await _unitOfWork.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken && !r.IsRevoked);
        if (stored == null || stored.ExpiresAt < DateTime.UtcNow)
        {
            return new AuthResponseDto { Success = false, Message = "Refresh token expired or invalid." };
        }

        stored.IsRevoked = true;
        _unitOfWork.RefreshTokens.Update(stored);

        var user = await _unitOfWork.Users.GetByIdWithRoleAsync(stored.UserId);
        if (user == null || !user.IsActive)
        {
            return new AuthResponseDto { Success = false, Message = "User account not found or deactivated." };
        }

        var newAccess = _jwtService.GenerateAccessToken(user);
        var newRefresh = _jwtService.GenerateRefreshToken();

        await _unitOfWork.RefreshTokens.AddAsync(new RefreshToken
        {
            Token = newRefresh,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(14)
        });
        await _unitOfWork.CompleteAsync();

        return new AuthResponseDto
        {
            Success = true,
            AccessToken = newAccess,
            RefreshToken = newRefresh,
            User = MapUserToDto(user)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdWithRoleAsync(userId);
        return user != null ? MapUserToDto(user) : null;
    }

    private static UserDto MapUserToDto(User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        PhoneNumber = u.PhoneNumber,
        Role = u.Role?.Name ?? "Reader",
        AvatarUrl = u.AvatarUrl,
        Bio = u.Bio,
        Username = u.Username,
        IsEmailVerified = u.IsEmailVerified,
        IsPhoneVerified = u.IsPhoneVerified,
        IsActive = u.IsActive,
        IsSubscribed = u.IsSubscribed,
        SubscriptionExpiresAt = u.SubscriptionExpiresAt,
        SubscriptionPlan = u.SubscriptionPlan,
        CreatedAt = u.CreatedAt
    };
}

