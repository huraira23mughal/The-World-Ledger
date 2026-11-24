using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface ICommentService
{
    Task<CommentDto> AddCommentAsync(Guid articleId, Guid userId, string content);
    Task<List<CommentDto>> GetCommentsByArticleAsync(Guid articleId);
    Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, bool isAdmin);
}

public class CommentService : ICommentService
{
    private readonly IUnitOfWork _unitOfWork;

    public CommentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CommentDto> AddCommentAsync(Guid articleId, Guid userId, string content)
    {
        var article = await _unitOfWork.Articles.GetByIdAsync(articleId);
        if (article == null)
            throw new ArgumentException("Article not found.");

        var user = await _unitOfWork.Users.GetByIdWithRoleAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found.");

        var comment = new Comment
        {
            ArticleId = articleId,
            UserId = userId,
            Content = content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Comments.AddAsync(comment);
        await _unitOfWork.CompleteAsync();

        return new CommentDto
        {
            Id = comment.Id,
            ArticleId = comment.ArticleId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            TimeAgo = "Just now",
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role?.Name ?? "Reader",
                AvatarUrl = user.AvatarUrl,
                Username = user.Username
            }
        };
    }

    public async Task<List<CommentDto>> GetCommentsByArticleAsync(Guid articleId)
    {
        var comments = await _unitOfWork.Comments.Query()
            .Where(c => c.ArticleId == articleId)
            .Include(c => c.User)
                .ThenInclude(u => u.Role)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return comments.Select(c => new CommentDto
        {
            Id = c.Id,
            ArticleId = c.ArticleId,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            TimeAgo = GetTimeAgo(c.CreatedAt),
            User = new UserDto
            {
                Id = c.User.Id,
                FullName = c.User.FullName,
                Email = c.User.Email,
                Role = c.User.Role?.Name ?? "Reader",
                AvatarUrl = c.User.AvatarUrl,
                Username = c.User.Username
            }
        }).ToList();
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, bool isAdmin)
    {
        var comment = await _unitOfWork.Comments.GetByIdAsync(commentId);
        if (comment == null) return false;

        if (comment.UserId != userId && !isAdmin)
            return false;

        _unitOfWork.Comments.Remove(comment);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    private static string GetTimeAgo(DateTime dt)
    {
        var span = DateTime.UtcNow - dt;
        if (span.TotalMinutes < 1) return "Just now";
        if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes}m ago";
        if (span.TotalHours < 24) return $"{(int)span.TotalHours}h ago";
        if (span.TotalDays < 7) return $"{(int)span.TotalDays}d ago";
        return dt.ToString("d MMM yyyy");
    }
}

