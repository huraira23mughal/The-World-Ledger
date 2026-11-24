using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IAdminService
{
    Task<DashboardStatsDto> GetStatsAsync();
    Task<List<UserDto>> GetUsersAsync(int page = 1, int pageSize = 50);
    Task<bool> UpdateUserRoleAsync(Guid userId, string roleName);
    Task<bool> UpdateUserStatusAsync(Guid userId, bool isActive);
    Task<List<ArticleDto>> GetAdminArticlesAsync(int page = 1, int pageSize = 50);
}

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var totalUsers = await _unitOfWork.Users.CountAsync();
        var totalAuthors = await _unitOfWork.Users.CountAsync(u => u.RoleId == 2);
        var totalReaders = await _unitOfWork.Users.CountAsync(u => u.RoleId == 3);
        var totalSubscribers = await _unitOfWork.Users.CountAsync(u => u.IsSubscribed);
        var totalLiveNews = await _unitOfWork.LiveNews.CountAsync();
        var totalRevenue = await _unitOfWork.PaymentRecords.Query()
            .Where(p => p.Status == "Succeeded")
            .SumAsync(p => (decimal?)p.Amount) ?? 0m;

        var totalArticles = await _unitOfWork.Articles.CountAsync();
        var publishedArticles = await _unitOfWork.Articles.CountAsync(a => a.Status == ArticleStatus.Published);
        var draftArticles = await _unitOfWork.Articles.CountAsync(a => a.Status == ArticleStatus.Draft);

        var totalViews = await _unitOfWork.Articles.Query().SumAsync(a => a.ViewsCount);
        var totalComments = await _unitOfWork.Comments.CountAsync();
        var totalLikes = await _unitOfWork.Likes.CountAsync();

        var categories = await _unitOfWork.Categories.Query()
            .Include(c => c.Articles)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                PillarColor = c.PillarColor,
                AccentColor = c.AccentColor,
                ArticlesCount = c.Articles.Count(a => a.Status == ArticleStatus.Published)
            })
            .ToListAsync();

        var recentArticles = await _unitOfWork.Articles.Query()
            .Include(a => a.Author)
            .Include(a => a.Category)
            .OrderByDescending(a => a.CreatedAt)
            .Take(6)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Slug = a.Slug,
                Summary = a.Summary,
                Status = a.Status.ToString(),
                IsFeatured = a.IsFeatured,
                CreatedAt = a.CreatedAt,
                PublishedAt = a.PublishedAt,
                ViewsCount = a.ViewsCount,
                LikesCount = a.LikesCount,
                Author = new AuthorSummaryDto
                {
                    Id = a.Author.Id,
                    Name = a.Author.FullName,
                    Username = a.Author.Username
                },
                Category = new CategorySummaryDto
                {
                    Id = a.Category.Id,
                    Name = a.Category.Name,
                    Slug = a.Category.Slug,
                    PillarColor = a.Category.PillarColor
                }
            })
            .ToListAsync();

        return new DashboardStatsDto
        {
            TotalUsers = totalUsers,
            TotalAuthors = totalAuthors,
            TotalReaders = totalReaders,
            TotalSubscribers = totalSubscribers,
            TotalRevenue = totalRevenue,
            TotalLiveNews = totalLiveNews,
            TotalArticles = totalArticles,
            PublishedArticles = publishedArticles,
            DraftArticles = draftArticles,
            TotalViews = totalViews,
            TotalComments = totalComments,
            TotalLikes = totalLikes,
            CategoriesOverview = categories,
            RecentArticles = recentArticles
        };
    }

    public async Task<List<UserDto>> GetUsersAsync(int page = 1, int pageSize = 50)
    {
        var users = await _unitOfWork.Users.Query()
            .Include(u => u.Role)
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return users.Select(u => new UserDto
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
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, string roleName)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        var role = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name.ToLower() == roleName.ToLower());
        if (role == null) return false;

        user.RoleId = role.Id;
        user.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    public async Task<bool> UpdateUserStatusAsync(Guid userId, bool isActive)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    public async Task<List<ArticleDto>> GetAdminArticlesAsync(int page = 1, int pageSize = 50)
    {
        var articles = await _unitOfWork.Articles.Query()
            .Include(a => a.Author)
            .Include(a => a.Category)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return articles.Select(a => new ArticleDto
        {
            Id = a.Id,
            Title = a.Title,
            Slug = a.Slug,
            Summary = a.Summary,
            Status = a.Status.ToString(),
            IsFeatured = a.IsFeatured,
            CreatedAt = a.CreatedAt,
            PublishedAt = a.PublishedAt,
            ViewsCount = a.ViewsCount,
            LikesCount = a.LikesCount,
            Author = new AuthorSummaryDto
            {
                Id = a.Author.Id,
                Name = a.Author.FullName,
                Username = a.Author.Username
            },
            Category = new CategorySummaryDto
            {
                Id = a.Category.Id,
                Name = a.Category.Name,
                Slug = a.Category.Slug,
                PillarColor = a.Category.PillarColor
            }
        }).ToList();
    }
}

