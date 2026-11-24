using Microsoft.EntityFrameworkCore;
using WorldLedger.API.Data;
using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public class OTPRepository : Repository<OTPVerification>, IOTPRepository
{
    public OTPRepository(AppDbContext context) : base(context) { }

    public async Task<OTPVerification?> GetActiveOtpAsync(string identifier, string purpose)
    {
        var clean = identifier.Trim().ToLower();
        return await _context.OTPVerifications
            .Where(o => o.Identifier.ToLower() == clean &&
                        o.Purpose.ToLower() == purpose.ToLower() &&
                        !o.IsUsed &&
                        o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task InvalidateExistingOtpsAsync(string identifier, string purpose)
    {
        var clean = identifier.Trim().ToLower();
        var existing = await _context.OTPVerifications
            .Where(o => o.Identifier.ToLower() == clean &&
                        o.Purpose.ToLower() == purpose.ToLower() &&
                        !o.IsUsed)
            .ToListAsync();

        foreach (var item in existing)
        {
            item.IsUsed = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<int> GetRecentAttemptsCountAsync(string identifier, TimeSpan window)
    {
        var clean = identifier.Trim().ToLower();
        var cutoff = DateTime.UtcNow.Subtract(window);

        return await _context.OTPVerifications
            .CountAsync(o => o.Identifier.ToLower() == clean && o.CreatedAt >= cutoff);
    }
}

