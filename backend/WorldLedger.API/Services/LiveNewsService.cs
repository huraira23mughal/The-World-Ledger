using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface ILiveNewsService
{
    Task<List<LiveNewsItemDto>> GetNewsAsync(string? category = null, bool? isBreaking = null, bool? isLive = null, int limit = 30);
    Task<LiveNewsItemDto?> GetBreakingNewsAsync();
    Task<LiveNewsItemDto?> GetByIdAsync(Guid id);
    Task<LiveNewsItemDto> CreateNewsAsync(CreateLiveNewsDto dto);
    Task<LiveNewsItemDto?> UpdateNewsAsync(Guid id, UpdateLiveNewsDto dto);
    Task<bool> DeleteNewsAsync(Guid id);
}

public class LiveNewsService : ILiveNewsService
{
    private readonly IUnitOfWork _unitOfWork;

    public LiveNewsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<LiveNewsItemDto>> GetNewsAsync(string? category = null, bool? isBreaking = null, bool? isLive = null, int limit = 30)
    {
        var query = _unitOfWork.LiveNews.Query();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(n => n.Category.ToLower() == category.ToLower());
        }

        if (isBreaking.HasValue)
        {
            query = query.Where(n => n.IsBreaking == isBreaking.Value);
        }

        if (isLive.HasValue)
        {
            query = query.Where(n => n.IsLive == isLive.Value);
        }

        var items = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<LiveNewsItemDto?> GetBreakingNewsAsync()
    {
        var item = await _unitOfWork.LiveNews.Query()
            .Where(n => n.IsBreaking && n.IsLive)
            .OrderByDescending(n => n.CreatedAt)
            .FirstOrDefaultAsync();

        return item != null ? MapToDto(item) : null;
    }

    public async Task<LiveNewsItemDto?> GetByIdAsync(Guid id)
    {
        var item = await _unitOfWork.LiveNews.GetByIdAsync(id);
        return item != null ? MapToDto(item) : null;
    }

    public async Task<LiveNewsItemDto> CreateNewsAsync(CreateLiveNewsDto dto)
    {
        var item = new LiveNewsItem
        {
            Title = dto.Title.Trim(),
            Content = dto.Content.Trim(),
            Source = string.IsNullOrWhiteSpace(dto.Source) ? "The World Ledger Newsroom" : dto.Source.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "World" : dto.Category.Trim(),
            IsBreaking = dto.IsBreaking,
            IsLive = dto.IsLive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.LiveNews.AddAsync(item);
        await _unitOfWork.CompleteAsync();

        return MapToDto(item);
    }

    public async Task<LiveNewsItemDto?> UpdateNewsAsync(Guid id, UpdateLiveNewsDto dto)
    {
        var item = await _unitOfWork.LiveNews.GetByIdAsync(id);
        if (item == null) return null;

        if (dto.Title != null) item.Title = dto.Title.Trim();
        if (dto.Content != null) item.Content = dto.Content.Trim();
        if (dto.Source != null) item.Source = dto.Source.Trim();
        if (dto.Category != null) item.Category = dto.Category.Trim();
        if (dto.IsBreaking.HasValue) item.IsBreaking = dto.IsBreaking.Value;
        if (dto.IsLive.HasValue) item.IsLive = dto.IsLive.Value;
        item.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.LiveNews.Update(item);
        await _unitOfWork.CompleteAsync();

        return MapToDto(item);
    }

    public async Task<bool> DeleteNewsAsync(Guid id)
    {
        var item = await _unitOfWork.LiveNews.GetByIdAsync(id);
        if (item == null) return false;

        _unitOfWork.LiveNews.Remove(item);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    private static LiveNewsItemDto MapToDto(LiveNewsItem n)
    {
        return new LiveNewsItemDto
        {
            Id = n.Id,
            Title = n.Title,
            Content = n.Content,
            Source = n.Source,
            Category = n.Category,
            IsBreaking = n.IsBreaking,
            IsLive = n.IsLive,
            CreatedAt = n.CreatedAt,
            TimeAgo = ToTimeAgo(n.CreatedAt)
        };
    }

    private static string ToTimeAgo(DateTime dt)
    {
        var diff = DateTime.UtcNow - dt;
        if (diff.TotalMinutes < 1) return "Just now";
        if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes}m ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours}h ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays}d ago";
        return dt.ToString("d MMM, HH:mm");
    }
}

