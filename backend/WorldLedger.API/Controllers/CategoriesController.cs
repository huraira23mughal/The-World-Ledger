using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _unitOfWork.Categories.Query()
            .Include(c => c.Articles)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                PillarColor = c.PillarColor,
                AccentColor = c.AccentColor,
                ArticlesCount = c.Articles.Count(a => a.Status == ArticleStatus.Published)
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var category = await _unitOfWork.Categories.Query()
            .Include(c => c.Articles)
            .FirstOrDefaultAsync(c => c.Slug.ToLower() == slug.ToLower());

        if (category == null)
            return NotFound(new { message = "Category not found." });

        return Ok(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            PillarColor = category.PillarColor,
            AccentColor = category.AccentColor,
            ArticlesCount = category.Articles.Count(a => a.Status == ArticleStatus.Published)
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Category name is required." });

        var slug = dto.Name.ToLower().Trim().Replace(" ", "-").Replace("&", "and");
        if (await _unitOfWork.Categories.ExistsAsync(c => c.Slug == slug))
            return BadRequest(new { message = "A category with this name already exists." });

        var category = new Category
        {
            Name = dto.Name.Trim(),
            Slug = slug,
            Description = dto.Description,
            PillarColor = string.IsNullOrWhiteSpace(dto.PillarColor) ? "#052962" : dto.PillarColor,
            AccentColor = string.IsNullOrWhiteSpace(dto.AccentColor) ? "#005689" : dto.AccentColor
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.CompleteAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = category.Slug }, category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateCategoryDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return NotFound(new { message = "Category not found." });

        category.Name = dto.Name.Trim();
        category.Description = dto.Description;
        category.PillarColor = dto.PillarColor;
        category.AccentColor = dto.AccentColor;

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.CompleteAsync();

        return Ok(category);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return NotFound(new { message = "Category not found." });

        var hasArticles = await _unitOfWork.Articles.ExistsAsync(a => a.CategoryId == id);
        if (hasArticles)
            return BadRequest(new { message = "Cannot delete category that contains published articles." });

        _unitOfWork.Categories.Remove(category);
        await _unitOfWork.CompleteAsync();

        return Ok(new { success = true, message = "Category deleted." });
    }
}
