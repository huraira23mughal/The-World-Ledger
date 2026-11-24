using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public interface IOTPRepository : IRepository<OTPVerification>
{
    Task<OTPVerification?> GetActiveOtpAsync(string identifier, string purpose);
    Task InvalidateExistingOtpsAsync(string identifier, string purpose);
    Task<int> GetRecentAttemptsCountAsync(string identifier, TimeSpan window);
}

