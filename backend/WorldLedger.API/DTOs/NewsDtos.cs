using System.ComponentModel.DataAnnotations;

namespace WorldLedger.API.DTOs;

public class LiveNewsItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Source { get; set; } = "The World Ledger Newsroom";
    public string Category { get; set; } = "World";
    public bool IsBreaking { get; set; }
    public bool IsLive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TimeAgo { get; set; } = string.Empty;
}

public class CreateLiveNewsDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string Source { get; set; } = "The World Ledger Newsroom";

    public string Category { get; set; } = "World"; // World, Pakistan, Business, Sports, Technology

    public bool IsBreaking { get; set; } = false;

    public bool IsLive { get; set; } = true;
}

public class UpdateLiveNewsDto
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Source { get; set; }
    public string? Category { get; set; }
    public bool? IsBreaking { get; set; }
    public bool? IsLive { get; set; }
}

