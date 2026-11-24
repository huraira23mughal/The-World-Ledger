using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorldLedger.API.DTOs;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var users = await _adminService.GetUsersAsync(page, pageSize);
        return Ok(users);
    }

    [HttpPatch("users/{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateUserRoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Role))
            return BadRequest(new { message = "Role is required." });

        var success = await _adminService.UpdateUserRoleAsync(id, dto.Role);
        if (!success)
            return BadRequest(new { message = "Unable to update role. Ensure role is valid." });

        return Ok(new { success = true, role = dto.Role });
    }

    [HttpPatch("users/{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateUserStatusDto dto)
    {
        var success = await _adminService.UpdateUserStatusAsync(id, dto.IsActive);
        if (!success)
            return BadRequest(new { message = "Unable to update status." });

        return Ok(new { success = true, isActive = dto.IsActive });
    }

    [HttpGet("articles")]
    public async Task<IActionResult> GetArticles([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var articles = await _adminService.GetAdminArticlesAsync(page, pageSize);
        return Ok(articles);
    }
}
