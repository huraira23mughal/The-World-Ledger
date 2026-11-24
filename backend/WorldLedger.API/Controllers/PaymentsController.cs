using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorldLedger.API.DTOs;
using WorldLedger.API.Services;

namespace WorldLedger.API.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("contribute")]
    public async Task<IActionResult> Contribute([FromBody] ProcessPaymentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = Guid.TryParse(idStr, out var id) ? id : null;

        var receipt = await _paymentService.ProcessContributionAsync(dto, userId);
        return Ok(receipt);
    }

    [Authorize]
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(idStr, out var userId))
            return Unauthorized();

        var receipt = await _paymentService.SubscribeAsync(dto, userId);
        return Ok(receipt);
    }

    [Authorize]
    [HttpGet("subscription-status")]
    public async Task<IActionResult> GetSubscriptionStatus()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(idStr, out var userId))
            return Unauthorized();

        var status = await _paymentService.GetSubscriptionStatusAsync(userId);
        return Ok(status);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _paymentService.GetAllPaymentsAsync();
        return Ok(payments.Select(p => new
        {
            p.Id,
            p.Amount,
            p.Currency,
            p.PaymentType,
            p.PlanOrTier,
            p.TransactionId,
            p.Status,
            p.CreatedAt,
            User = p.User != null ? new { p.User.Id, p.User.FullName, p.User.Email } : null,
            Article = p.Article != null ? new { p.Article.Id, p.Article.Title, p.Article.Slug } : null
        }));
    }
}
