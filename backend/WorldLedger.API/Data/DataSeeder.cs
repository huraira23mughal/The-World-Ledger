using Microsoft.EntityFrameworkCore;
using WorldLedger.API.Entities;

namespace WorldLedger.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync();

        // 1. Seed Roles
        if (!await db.Roles.AnyAsync())
        {
            var roles = new[]
            {
                new Role { Id = 1, Name = "Admin", Description = "System administrator with full editorial and user management permissions" },
                new Role { Id = 2, Name = "Author", Description = "Verified journalist or contributor permitted to write, draft, and publish articles" },
                new Role { Id = 3, Name = "Reader", Description = "Standard community subscriber who can comment, like, and bookmark articles" }
            };
            await db.Roles.AddRangeAsync(roles);
            await db.SaveChangesAsync();
        }

        // 2. Seed Default Administrator Account
        if (!await db.Users.AnyAsync(u => u.Email == "admin@theworldledger.com"))
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Eleanor Vance (Chief Editor)",
                Email = "admin@theworldledger.com",
                PhoneNumber = "+12025550143",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456!"),
                RoleId = 1, // Admin
                AvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&q=80",
                Bio = "Editor-in-Chief & Platform Administrator at The World Ledger.",
                Username = "eleanor-vance",
                IsEmailVerified = true,
                IsPhoneVerified = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await db.Users.AddAsync(adminUser);
            await db.SaveChangesAsync();
        }

        // 3. Seed Guardian-Style Sections and Categories (NO dummy articles)
        if (!await db.Categories.AnyAsync())
        {
            var categories = new[]
            {
                // News Pillars
                new Category { Name = "World", Slug = "world", Description = "International diplomacy, geopolitical developments, and reports from global correspondents.", PillarColor = "#052962", AccentColor = "#005689" },
                new Category { Name = "US Politics", Slug = "us-politics", Description = "White House, Capitol Hill debates, executive policy, and electoral coverage.", PillarColor = "#052962", AccentColor = "#004975" },
                new Category { Name = "UK News", Slug = "uk-news", Description = "Westminster, public policy, devolved administrations, and British affairs.", PillarColor = "#052962", AccentColor = "#003b8e" },
                new Category { Name = "Climate Crisis", Slug = "climate-crisis", Description = "Atmospheric science, renewable transitions, global treaties, and ecosystem conservation.", PillarColor = "#004975", AccentColor = "#22874d" },
                new Category { Name = "Middle East", Slug = "middle-east", Description = "Regional diplomacy, security analysis, civil rights, and peace frameworks.", PillarColor = "#052962", AccentColor = "#005689" },
                new Category { Name = "Ukraine", Slug = "ukraine", Description = "European security, aid packages, reconstruction summits, and territorial updates.", PillarColor = "#052962", AccentColor = "#004975" },
                new Category { Name = "Environment", Slug = "environment", Description = "Biodiversity, ocean conservation, species protection, and circular economy.", PillarColor = "#22874d", AccentColor = "#185b54" },
                new Category { Name = "Science", Slug = "science", Description = "Biomedical research, space exploration, quantum technologies, and physics discoveries.", PillarColor = "#003b8e", AccentColor = "#0077b6" },
                new Category { Name = "Global Development", Slug = "global-development", Description = "Global health, poverty reduction, food sovereignty, and humanitarian aid.", PillarColor = "#004975", AccentColor = "#052962" },

                // Opinion Pillars
                new Category { Name = "The Guardian View", Slug = "the-guardian-view", Description = "The World Ledger editorial board positions on critical global events.", PillarColor = "#e05e00", AccentColor = "#fef9f5" },
                new Category { Name = "Columnists", Slug = "columnists", Description = "Weekly thought leadership, analytical essays, and distinct contributor voices.", PillarColor = "#e05e00", AccentColor = "#d65300" },
                new Category { Name = "Cartoons", Slug = "cartoons", Description = "Political satire, visual commentary, and editorial illustrations.", PillarColor = "#e05e00", AccentColor = "#fef9f5" },
                new Category { Name = "Letters", Slug = "letters", Description = "Reader perspectives, debate submissions, and correspondence to the editor.", PillarColor = "#e05e00", AccentColor = "#b84500" },

                // Sport Pillars
                new Category { Name = "Football", Slug = "football", Description = "Premier League, Champions League, international tournaments, and tactical reviews.", PillarColor = "#22874d", AccentColor = "#176135" },
                new Category { Name = "Cricket", Slug = "cricket", Description = "Test matches, one-day internationals, county championships, and global series.", PillarColor = "#22874d", AccentColor = "#185b54" },
                new Category { Name = "Rugby Union", Slug = "rugby-union", Description = "Six Nations, Premiership, southern hemisphere tours, and World Cup news.", PillarColor = "#22874d", AccentColor = "#176135" },
                new Category { Name = "Tennis", Slug = "tennis", Description = "Grand Slam championships, ATP/WTA tours, player profiles, and match courts.", PillarColor = "#22874d", AccentColor = "#22874d" },
                new Category { Name = "Formula 1", Slug = "formula-1", Description = "Grand Prix reports, constructor standings, telemetry insights, and driver movements.", PillarColor = "#22874d", AccentColor = "#004975" },

                // Culture Pillars
                new Category { Name = "Books", Slug = "books", Description = "Literary reviews, author interviews, non-fiction deep dives, and prize shortlists.", PillarColor = "#7d0068", AccentColor = "#a11689" },
                new Category { Name = "Music", Slug = "music", Description = "Album reviews, orchestral releases, festival coverage, and artist spotlights.", PillarColor = "#7d0068", AccentColor = "#5a004b" },
                new Category { Name = "Film", Slug = "film", Description = "Cinema reviews, festival premieres, director interviews, and box office analysis.", PillarColor = "#7d0068", AccentColor = "#a11689" },
                new Category { Name = "Art & Design", Slug = "art-and-design", Description = "Architecture exhibitions, gallery retrospectives, and visual culture critiques.", PillarColor = "#7d0068", AccentColor = "#7d0068" },
                new Category { Name = "Stage", Slug = "stage", Description = "Theatre openings, opera productions, contemporary dance, and performance art.", PillarColor = "#7d0068", AccentColor = "#5a004b" },

                // Lifestyle Pillars
                new Category { Name = "Fashion", Slug = "fashion", Description = "Sustainable style, runway retrospectives, ethical textiles, and garment craft.", PillarColor = "#008b8b", AccentColor = "#185b54" },
                new Category { Name = "Food & Recipes", Slug = "food", Description = "Seasonal cooking, restaurant critiques, artisan producers, and culinary guides.", PillarColor = "#008b8b", AccentColor = "#006d6d" },
                new Category { Name = "Travel", Slug = "travel", Description = "Slow travel, expedition guides, cultural itineraries, and eco-tourism.", PillarColor = "#008b8b", AccentColor = "#185b54" },
                new Category { Name = "Health & Fitness", Slug = "health", Description = "Preventative medicine, mental wellbeing, athletic training, and sleep science.", PillarColor = "#008b8b", AccentColor = "#008b8b" },

                // More
                new Category { Name = "Business", Slug = "business", Description = "Central banks, capital markets, international trade flows, and economic data.", PillarColor = "#004975", AccentColor = "#22874d" },
                new Category { Name = "Technology", Slug = "technology", Description = "Artificial intelligence, computing frontiers, digital sovereignty, and privacy.", PillarColor = "#003b8e", AccentColor = "#0077b6" },
                new Category { Name = "Obituaries", Slug = "obituaries", Description = "Tributes and commemorations of notable figures who shaped modern history.", PillarColor = "#333333", AccentColor = "#555555" }
            };

            await db.Categories.AddRangeAsync(categories);
            await db.SaveChangesAsync();
        }

        // 4. Seed Standard Tags
        if (!await db.Tags.AnyAsync())
        {
            var tags = new[]
            {
                new Tag { Name = "Global Politics", Slug = "global-politics" },
                new Tag { Name = "Climate Change", Slug = "climate-change" },
                new Tag { Name = "Artificial Intelligence", Slug = "artificial-intelligence" },
                new Tag { Name = "Economy", Slug = "economy" },
                new Tag { Name = "Diplomacy", Slug = "diplomacy" },
                new Tag { Name = "Investigation", Slug = "investigation" },
                new Tag { Name = "Public Health", Slug = "public-health" },
                new Tag { Name = "Literature", Slug = "literature" },
                new Tag { Name = "Renewable Energy", Slug = "renewable-energy" }
            };
            await db.Tags.AddRangeAsync(tags);
            await db.SaveChangesAsync();
        }

        // 4. Seed Live News if empty
        if (!await db.LiveNewsItems.AnyAsync())
        {
            var liveNews = new[]
            {
                new LiveNewsItem
                {
                    Title = "Global Climate Accord Reached at Geneva Summit",
                    Content = "Delegates from over 140 nations agree on a new multi-lateral climate financing framework with binding emissions targets.",
                    Category = "World",
                    Source = "World Ledger Global Desk",
                    IsLive = true,
                    IsBreaking = true,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-12)
                },
                new LiveNewsItem
                {
                    Title = "State Bank of Pakistan Reports Record Remittances in Q3",
                    Content = "Inflows surge past expectations driven by formal channel incentives and digital banking adoption across overseas diaspora.",
                    Category = "Pakistan",
                    Source = "Lahore Bureau",
                    IsLive = true,
                    IsBreaking = false,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-34)
                },
                new LiveNewsItem
                {
                    Title = "Markets Rally as Central Banks Signal Rate Reductions",
                    Content = "Global equity indices climbed over 1.8% following positive inflation readings and coordinated dovish forward guidance.",
                    Category = "Business",
                    Source = "Financial Markets Desk",
                    IsLive = true,
                    IsBreaking = false,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-58)
                },
                new LiveNewsItem
                {
                    Title = "Next-Gen Quantum Processing Architecture Demonstrated",
                    Content = "Researchers demonstrate room-temperature coherence in silicon lattice, clearing a major hurdle for commercially viable quantum clusters.",
                    Category = "Technology",
                    Source = "Tech & Science Wire",
                    IsLive = true,
                    IsBreaking = false,
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new LiveNewsItem
                {
                    Title = "ICC World Championship: Final Four Contenders Solidify Standings",
                    Content = "Decisive victories in the group stage set up thrilling weekend semi-finals as tournament favorites advance with flawless records.",
                    Category = "Sports",
                    Source = "Sports Desk",
                    IsLive = true,
                    IsBreaking = false,
                    CreatedAt = DateTime.UtcNow.AddHours(-3)
                }
            };
            await db.LiveNewsItems.AddRangeAsync(liveNews);
            await db.SaveChangesAsync();
        }
    }
}
