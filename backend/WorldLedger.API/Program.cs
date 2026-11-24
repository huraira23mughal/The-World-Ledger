using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WorldLedger.API.Data;
using WorldLedger.API.Repositories;
using WorldLedger.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Determine Database Provider (Supports SQL Server, PostgreSQL, and SQLite)
var provider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var connString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=worldledger.db";

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        var sqlServerConn = builder.Configuration.GetConnectionString("SqlServerConnection") ?? connString;
        opt.UseSqlServer(sqlServerConn);
    }
    else if (provider.Equals("PostgreSql", StringComparison.OrdinalIgnoreCase) || provider.Equals("Postgres", StringComparison.OrdinalIgnoreCase))
    {
        var pgConn = builder.Configuration.GetConnectionString("PostgreSqlConnection") ?? connString;
        opt.UseNpgsql(pgConn);
    }
    else
    {
        opt.UseSqlite(connString);
    }
});

// Dependency Injection - Clean 3-Layer Architecture
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IOTPService, OTPService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IInteractionService, InteractionService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ILiveNewsService, LiveNewsService>();

// JWT Bearer Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "WorldLedger_SuperSecret_JWT_Key_2026_MustBe32CharsOrMore!";
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2),
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.NameIdentifier
    };
});

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    opt.AddPolicy("AuthorOrAdmin", p => p.RequireRole("Author", "Admin"));
});

// CORS Configuration
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Ensure wwwroot/uploads directory exists
var webRoot = app.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
var uploadsDir = Path.Combine(webRoot, "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}

// Database Migration & Seeding
try
{
    // Auto-migrate data from SQLite if switching to SQL Server and SQLite DB exists
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        var sqliteFile = Path.Combine(app.Environment.ContentRootPath, "worldledger.db");
        if (File.Exists(sqliteFile))
        {
            try
            {
                var sqliteConnStr = $"Data Source={sqliteFile}";
                var sqlServerConnStr = builder.Configuration.GetConnectionString("SqlServerConnection") ?? connString;
                DataMigrator.MigrateFromSqlite(sqliteConnStr, sqlServerConnStr);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WARN] Data migration from SQLite note: {ex.Message}");
            }
        }
    }

    await DataSeeder.SeedAsync(app.Services);
    Console.WriteLine("[INFO] Database schema verified and essential editorial data seeded successfully.");
}
catch (Exception ex)
{
    Console.WriteLine($"[WARN] Database initial seeding note: {ex.Message}");
}

app.UseCors("AllowFrontend");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    platform = "The World Ledger Broadcaster API",
    version = "2.0.0",
    timestamp = DateTime.UtcNow,
    provider = provider
}));

// Fallback to React SPA for non-API routes
app.MapFallbackToFile("index.html");

app.Run();