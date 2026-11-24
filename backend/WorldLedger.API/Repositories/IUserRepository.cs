using WorldLedger.API.Entities;

namespace WorldLedger.API.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailOrPhoneAsync(string identifier);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdWithRoleAsync(Guid id);
    Task<IEnumerable<User>> GetAllWithRolesAsync();
}

