using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldLedger.API.DTOs;
using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/authors")]
public class AuthorsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IArticleService _articleService;

    public AuthorsController(IUnitOfWork unitOfWork, IArticleService articleService)
    {
        _unitOfWork = unitOfWork;
        _articleService = articleService;
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetAuthorProfile(string username)
    {
        var author = await _unitOfWork.Users.Query()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username != null && u.Username.ToLower() == username.ToLower());

        if (author == null)
            return NotFound(new { message = "Author profile not found." });

        var articles = await _articleService.GetAuthorArticlesAsync(author.Id, publishedOnly: true);

        return Ok(new
        {
            Author = new AuthorSummaryDto
            {
                Id = author.Id,
                Name = author.FullName,
                Username = author.Username,
                AvatarUrl = author.AvatarUrl,
                Bio = author.Bio
            },
            Role = author.Role?.Name,
            TotalArticles = articles.Count,
            TotalViews = articles.Sum(a => a.ViewsCount),
            Articles = articles
        });
    }
}
