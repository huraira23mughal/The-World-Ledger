namespace WorldLedger.API.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string PillarColor { get; set; } = "#052962";
    public string AccentColor { get; set; } = "#005689";
    public int ArticlesCount { get; set; }
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string PillarColor { get; set; } = "#052962";
    public string AccentColor { get; set; } = "#005689";
}

public class TagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int ArticlesCount { get; set; }
}

public class CreateTagDto
{
    public string Name { get; set; } = string.Empty;
}

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalAuthors { get; set; }
    public int TotalReaders { get; set; }
    public int TotalSubscribers { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalLiveNews { get; set; }
    public int TotalArticles { get; set; }
    public int PublishedArticles { get; set; }
    public int DraftArticles { get; set; }
    public int TotalViews { get; set; }
    public int TotalComments { get; set; }
    public int TotalLikes { get; set; }
    public List<CategoryDto> CategoriesOverview { get; set; } = new();
    public List<ArticleDto> RecentArticles { get; set; } = new();
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty; // "Admin", "Author", "Reader"
}

public class UpdateUserStatusDto
{
    public bool IsActive { get; set; }
}

