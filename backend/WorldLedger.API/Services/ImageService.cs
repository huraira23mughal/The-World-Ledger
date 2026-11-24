using WorldLedger.API.Entities;
using WorldLedger.API.Repositories;

namespace WorldLedger.API.Services;

public interface IImageService
{
    Task<(bool Success, string Message, string? Url, Guid? ImageId)> UploadImageAsync(IFormFile file, Guid uploadedById, string? caption = null);
}

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IUnitOfWork _unitOfWork;

    public ImageService(IWebHostEnvironment env, IUnitOfWork unitOfWork)
    {
        _env = env;
        _unitOfWork = unitOfWork;
    }

    public async Task<(bool Success, string Message, string? Url, Guid? ImageId)> UploadImageAsync(IFormFile file, Guid uploadedById, string? caption = null)
    {
        if (file == null || file.Length == 0)
            return (false, "No file provided.", null, null);

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return (false, "Invalid file format. Only JPG, PNG, WEBP, and GIF are allowed.", null, null);

        if (file.Length > 10 * 1024 * 1024) // 10MB limit
            return (false, "File size exceeds maximum 10MB limit.", null, null);

        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");
        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var publicUrl = $"/uploads/{uniqueFileName}";

        var imageEntity = new Image
        {
            FileName = file.FileName,
            FilePath = filePath,
            Url = publicUrl,
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedById = uploadedById,
            Caption = caption,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Images.AddAsync(imageEntity);
        await _unitOfWork.CompleteAsync();

        return (true, "Image uploaded successfully.", publicUrl, imageEntity.Id);
    }
}

