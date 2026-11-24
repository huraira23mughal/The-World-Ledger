using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[Authorize]
[ApiController]
[Route("api/bookmarks")]
public class BookmarksController : ControllerBase
{
    private readonly IInteractionService _interactionService;

    public BookmarksController(IInteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(idStr, out var userId))
            return Unauthorized();

        var bookmarks = await _interactionService.GetUserBookmarksAsync(userId, page, pageSize);
        return Ok(bookmarks);
    }
}

