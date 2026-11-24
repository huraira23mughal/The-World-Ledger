using System.Security.Cryptography;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IOTPService
{
    Task<(bool Success, string Message, string? Code)> GenerateAndSendOtpAsync(string identifier, string purpose);
    Task<(bool Success, string Message)> VerifyOtpAsync(string identifier, string code, string purpose);
}

public class OTPService : IOTPService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<OTPService> _logger;
    private const int MaxAttemptsPerWindow = 5;
    private static readonly TimeSpan RateLimitWindow = TimeSpan.FromMinutes(10);
    private static readonly TimeSpan OtpExpiry = TimeSpan.FromMinutes(10);

    public OTPService(IUnitOfWork unitOfWork, ILogger<OTPService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<(bool Success, string Message, string? Code)> GenerateAndSendOtpAsync(string identifier, string purpose)
    {
        var clean = identifier.Trim();

        // 1. Rate limiting check
        var recentAttempts = await _unitOfWork.OTPs.GetRecentAttemptsCountAsync(clean, RateLimitWindow);
        if (recentAttempts >= MaxAttemptsPerWindow)
        {
            return (false, "Too many OTP requests. Please wait 10 minutes before requesting a new code.", null);
        }

        // 2. Invalidate previous unexpired OTPs for this identifier & purpose
        await _unitOfWork.OTPs.InvalidateExistingOtpsAsync(clean, purpose);

        // 3. Generate 6-digit secure numeric OTP
        var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();

        // 4. Save to Database
        var otp = new OTPVerification
        {
            Identifier = clean,
            OtpCode = code,
            Purpose = purpose,
            ExpiresAt = DateTime.UtcNow.Add(OtpExpiry),
            IsUsed = false,
            AttemptsCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.OTPs.AddAsync(otp);
        await _unitOfWork.CompleteAsync();

        // 5. Send via simulated Email / SMS dispatcher
        if (clean.Contains('@'))
        {
            _logger.LogInformation("[DISPATCH EMAIL OTP] To: {Email} | Purpose: {Purpose} | Code: {Code} | Valid for: 10 mins", clean, purpose, code);
        }
        else
        {
            _logger.LogInformation("[DISPATCH SMS OTP] To: {Phone} | Purpose: {Purpose} | Code: {Code} | Valid for: 10 mins", clean, purpose, code);
        }

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n=======================================================");
        Console.WriteLine($" [THE WORLD LEDGER SECURE OTP DISPATCH] ");
        Console.WriteLine($" Destination: {clean}");
        Console.WriteLine($" Purpose:     {purpose}");
        Console.WriteLine($" Verification Code: >>> {code} <<<");
        Console.WriteLine($" Expires in:  10 minutes");
        Console.WriteLine($"=======================================================\n");
        Console.ResetColor();

        return (true, $"A 6-digit verification code has been dispatched to {clean}.", code);
    }

    public async Task<(bool Success, string Message)> VerifyOtpAsync(string identifier, string code, string purpose)
    {
        var clean = identifier.Trim();
        var activeOtp = await _unitOfWork.OTPs.GetActiveOtpAsync(clean, purpose);

        if (activeOtp == null)
        {
            return (false, "No active or valid verification code found. Please request a new code.");
        }

        activeOtp.AttemptsCount++;

        if (activeOtp.AttemptsCount > 5)
        {
            activeOtp.IsUsed = true; // Lock down
            await _unitOfWork.CompleteAsync();
            return (false, "Maximum verification attempts exceeded. Please request a new code.");
        }

        if (activeOtp.OtpCode != code.Trim())
        {
            await _unitOfWork.CompleteAsync();
            return (false, "Invalid verification code. Please check and try again.");
        }

        // Successfully verified
        activeOtp.IsUsed = true;
        await _unitOfWork.CompleteAsync();

        return (true, "Code verified successfully.");
    }
}

