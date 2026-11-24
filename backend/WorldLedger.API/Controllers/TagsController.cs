using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/tags")]
public class TagsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public TagsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await _unitOfWork.Tags.Query()
            .Include(t => t.ArticleTags)
            .OrderBy(t => t.Name)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                ArticlesCount = t.ArticleTags.Count
            })
            .ToListAsync();

        return Ok(tags);
    }

    [Authorize(Roles = "Author,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Tag name is required." });

        var slug = dto.Name.ToLower().Trim().Replace(" ", "-").Replace("#", "");
        var existing = await _unitOfWork.Tags.FirstOrDefaultAsync(t => t.Slug == slug);
        if (existing != null)
            return Ok(new TagDto { Id = existing.Id, Name = existing.Name, Slug = existing.Slug });

        var tag = new Tag
        {
            Name = dto.Name.Trim(),
            Slug = slug
        };

        await _unitOfWork.Tags.AddAsync(tag);
        await _unitOfWork.CompleteAsync();

        return Ok(new TagDto { Id = tag.Id, Name = tag.Name, Slug = tag.Slug });
    }
}

