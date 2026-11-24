using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IPaymentService
{
    Task<PaymentReceiptDto> ProcessContributionAsync(ProcessPaymentDto dto, Guid? userId = null);
    Task<PaymentReceiptDto> SubscribeAsync(SubscribeRequestDto dto, Guid userId);
    Task<SubscriptionStatusDto> GetSubscriptionStatusAsync(Guid userId);
    Task<List<PaymentRecord>> GetAllPaymentsAsync();
}

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PaymentReceiptDto> ProcessContributionAsync(ProcessPaymentDto dto, Guid? userId = null)
    {
        var txnId = $"TXN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
        var receiptNum = $"WL-REC-{DateTime.UtcNow.Year}-{Random.Shared.Next(100000, 999999)}";

        var payment = new PaymentRecord
        {
            UserId = userId,
            Amount = dto.Amount,
            Currency = dto.Currency,
            PaymentType = "Donation",
            PlanOrTier = dto.PlanOrTier,
            TransactionId = txnId,
            Status = "Completed",
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.PaymentRecords.AddAsync(payment);
        await _unitOfWork.CompleteAsync();

        return new PaymentReceiptDto
        {
            Success = true,
            Message = "Thank you for supporting independent journalism. Your contribution keeps The World Ledger open to all.",
            TransactionId = txnId,
            ReceiptNumber = receiptNum,
            Amount = dto.Amount,
            Currency = dto.Currency,
            PlanOrTier = dto.PlanOrTier,
            Frequency = dto.Frequency,
            ProcessedAt = DateTime.UtcNow,
            Status = "Completed"
        };
    }

    public async Task<PaymentReceiptDto> SubscribeAsync(SubscribeRequestDto dto, Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found.");
        }

        decimal amount = dto.Plan.Equals("Author", StringComparison.OrdinalIgnoreCase) ? 49.00m : 5.00m;
        var planName = dto.Plan.Equals("Author", StringComparison.OrdinalIgnoreCase) ? "Author Pro Pass" : "Reader Supporter All-Access";

        var txnId = $"TXN-SUB-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
        var receiptNum = $"WL-SUB-{DateTime.UtcNow.Year}-{Random.Shared.Next(100000, 999999)}";

        // Update user subscription
        user.IsSubscribed = true;
        user.SubscriptionExpiresAt = DateTime.UtcNow.AddMonths(1);
        user.SubscriptionPlan = dto.Plan;
        user.UpdatedAt = DateTime.UtcNow;

        var payment = new PaymentRecord
        {
            UserId = userId,
            Amount = amount,
            Currency = "USD",
            PaymentType = "Subscription",
            PlanOrTier = planName,
            TransactionId = txnId,
            Status = "Completed",
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.PaymentRecords.AddAsync(payment);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        return new PaymentReceiptDto
        {
            Success = true,
            Message = $"Subscription activated successfully for {planName}!",
            TransactionId = txnId,
            ReceiptNumber = receiptNum,
            Amount = amount,
            Currency = "USD",
            PlanOrTier = planName,
            Frequency = "Monthly",
            ProcessedAt = DateTime.UtcNow,
            Status = "Active"
        };
    }

    public async Task<SubscriptionStatusDto> GetSubscriptionStatusAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            return new SubscriptionStatusDto { IsSubscribed = false, CanAccessPremium = false };
        }

        var isActive = user.IsSubscribed && (user.SubscriptionExpiresAt == null || user.SubscriptionExpiresAt > DateTime.UtcNow);
        var canAccess = isActive || user.RoleId == 1; // Admins get premium access

        return new SubscriptionStatusDto
        {
            IsSubscribed = isActive,
            Plan = user.SubscriptionPlan,
            ExpiresAt = user.SubscriptionExpiresAt,
            CanAccessPremium = canAccess
        };
    }

    public async Task<List<PaymentRecord>> GetAllPaymentsAsync()
    {
        return await _unitOfWork.PaymentRecords.Query()
            .Include(p => p.User)
            .Include(p => p.Article)
            .OrderByDescending(p => p.CreatedAt)
            .Take(100)
            .ToListAsync();
    }
}
