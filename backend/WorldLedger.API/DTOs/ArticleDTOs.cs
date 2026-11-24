using System.ComponentModel.DataAnnotations;

namespace WorldLedger.API.DTOs;

public class CreateArticleDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Summary { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty; // Rich text HTML / markdown

    [Required]
    public Guid CategoryId { get; set; }

    public string? FeaturedImageUrl { get; set; }
    public string? ImageCaption { get; set; }
    public string? Kicker { get; set; }
    public string ReadTime { get; set; } = "5 min read";

    public List<string> TagNames { get; set; } = new();

    public bool IsPremium { get; set; } = false;
    public bool IsDraft { get; set; } = false;
}

public class UpdateArticleDto
{
    public string? Title { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public Guid? CategoryId { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? ImageCaption { get; set; }
    public string? Kicker { get; set; }
    public string? ReadTime { get; set; }
    public List<string>? TagNames { get; set; }
    public bool? IsPremium { get; set; }
    public bool? IsDraft { get; set; }
}

public class ArticleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public string? ImageCaption { get; set; }
    public string? Kicker { get; set; }
    public string ReadTime { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public bool IsPremium { get; set; }
    public bool IsPaid { get; set; }
    public bool IsPaywalled { get; set; } = false;
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TimeAgo { get; set; } = string.Empty;

    public int ViewsCount { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }

    public bool IsLikedByCurrentUser { get; set; } = false;
    public bool IsBookmarkedByCurrentUser { get; set; } = false;

    public AuthorSummaryDto Author { get; set; } = null!;
    public CategorySummaryDto Category { get; set; } = null!;
    public List<TagDto> Tags { get; set; } = new();
    public List<CommentDto> Comments { get; set; } = new();
}

public class AuthorSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Username { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
}

public class CategorySummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string PillarColor { get; set; } = "#052962";
    public string AccentColor { get; set; } = "#005689";
}

public class ArticleListDto
{
    public List<ArticleDto> Articles { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class CommentDto
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string TimeAgo { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class CreateCommentDto
{
    [Required]
    public string Content { get; set; } = string.Empty;
}

