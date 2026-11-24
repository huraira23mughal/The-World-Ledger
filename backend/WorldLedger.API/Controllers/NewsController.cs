using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorldLedger.API.DTOs;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly ILiveNewsService _newsService;

    public NewsController(ILiveNewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetNews(
        [FromQuery] string? category,
        [FromQuery] bool? isBreaking,
        [FromQuery] bool? isLive,
        [FromQuery] int limit = 30)
    {
        var news = await _newsService.GetNewsAsync(category, isBreaking, isLive, limit);
        return Ok(news);
    }

    [HttpGet("breaking")]
    public async Task<IActionResult> GetBreakingNews()
    {
        var breaking = await _newsService.GetBreakingNewsAsync();
        return Ok(breaking);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var news = await _newsService.GetByIdAsync(id);
        if (news == null) return NotFound(new { message = "News update not found." });
        return Ok(news);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateNews([FromBody] CreateLiveNewsDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var news = await _newsService.CreateNewsAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = news.Id }, news);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateNews(Guid id, [FromBody] UpdateLiveNewsDto dto)
    {
        var news = await _newsService.UpdateNewsAsync(id, dto);
        if (news == null) return NotFound(new { message = "News update not found." });
        return Ok(news);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteNews(Guid id)
    {
        var success = await _newsService.DeleteNewsAsync(id);
        if (!success) return NotFound(new { message = "News update not found." });
        return Ok(new { success = true, message = "News update deleted." });
    }
}

