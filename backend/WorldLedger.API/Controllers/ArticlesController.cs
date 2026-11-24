using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/articles")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;
    private readonly ICommentService _commentService;
    private readonly IInteractionService _interactionService;

    public ArticlesController(
        IArticleService articleService,
        ICommentService commentService,
        IInteractionService interactionService)
    {
        _articleService = articleService;
        _commentService = commentService;
        _interactionService = interactionService;
    }

    private Guid? GetCurrentUserId()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(idStr, out var id) ? id : null;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles(
        [FromQuery] string? category,
        [FromQuery] string? tag,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var currentUserId = GetCurrentUserId();
        var result = await _articleService.GetPublishedArticlesAsync(category, tag, search, page, pageSize, currentUserId);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedArticles()
    {
        var result = await _articleService.GetFeaturedArticlesAsync();
        return Ok(result);
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopularArticles()
    {
        var result = await _articleService.GetMostPopularArticlesAsync();
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var currentUserId = GetCurrentUserId();
        var article = await _articleService.GetBySlugAsync(slug, ip, currentUserId);
        if (article == null)
            return NotFound(new { message = "Article not found." });

        // Augment with interaction status
        var (isLiked, isBookmarked) = await _interactionService.GetStatusAsync(article.Id, currentUserId);
        article.IsLikedByCurrentUser = isLiked;
        article.IsBookmarkedByCurrentUser = isBookmarked;

        return Ok(article);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        var article = await _articleService.GetByIdAsync(id, currentUserId);
        if (article == null)
            return NotFound(new { message = "Article not found." });

        var (isLiked, isBookmarked) = await _interactionService.GetStatusAsync(article.Id, currentUserId);
        article.IsLikedByCurrentUser = isLiked;
        article.IsBookmarkedByCurrentUser = isBookmarked;

        return Ok(article);
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateArticle([FromBody] CreateArticleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        var article = await _articleService.CreateArticleAsync(currentUserId.Value, dto);
        return CreatedAtAction(nameof(GetById), new { id = article.Id }, article);
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] UpdateArticleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        var updated = await _articleService.UpdateArticleAsync(id, currentUserId.Value, isAdmin, dto);
        if (updated == null)
            return NotFound(new { message = "Article not found or you are not authorized to edit it." });

        return Ok(updated);
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpPost("{id:guid}/publish-payment")]
    public async Task<IActionResult> PublishWithPayment(Guid id, [FromBody] PublishArticlePaymentDto dto)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        try
        {
            var article = await _articleService.ProcessPublishPaymentAsync(id, currentUserId.Value, dto);
            if (article == null)
                return NotFound(new { message = "Article not found." });

            return Ok(article);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteArticle(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        var success = await _articleService.DeleteArticleAsync(id, currentUserId.Value, isAdmin);
        if (!success)
            return NotFound(new { message = "Article not found or you are not authorized to delete it." });

        return Ok(new { success = true, message = "Article deleted successfully." });
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ArticleStatus status)
    {
        var success = await _articleService.ChangeStatusAsync(id, status);
        if (!success)
            return NotFound(new { message = "Article not found." });

        return Ok(new { success = true, status = status.ToString() });
    }

    [HttpGet("{id:guid}/comments")]
    public async Task<IActionResult> GetComments(Guid id)
    {
        var comments = await _commentService.GetCommentsByArticleAsync(id);
        return Ok(comments);
    }

    [Authorize]
    [HttpPost("{id:guid}/comments")]
    public async Task<IActionResult> AddComment(Guid id, [FromBody] CreateCommentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        try
        {
            var comment = await _commentService.AddCommentAsync(id, currentUserId.Value, dto.Content);
            return Ok(comment);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{id:guid}/comments/{commentId:guid}")]
    public async Task<IActionResult> DeleteComment(Guid id, Guid commentId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        var success = await _commentService.DeleteCommentAsync(commentId, currentUserId.Value, isAdmin);
        if (!success)
            return BadRequest(new { message = "Unable to delete comment." });

        return Ok(new { success = true });
    }

    [Authorize]
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        try
        {
            var (isLiked, likesCount) = await _interactionService.ToggleLikeAsync(id, currentUserId.Value);
            return Ok(new { isLiked, likesCount });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("{id:guid}/bookmark")]
    public async Task<IActionResult> ToggleBookmark(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
            return Unauthorized();

        try
        {
            var isBookmarked = await _interactionService.ToggleBookmarkAsync(id, currentUserId.Value);
            return Ok(new { isBookmarked });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
