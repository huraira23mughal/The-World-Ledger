using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;

namespace WorldLedger.API.Data;

public static class DataMigrator
{
    public static void MigrateFromSqlite(string sqliteConnString, string sqlServerConnString)
    {
        Console.WriteLine("[MIGRATOR] Starting SQLite to SQL Server data migration...");

        using var sqliteConn = new SqliteConnection(sqliteConnString);
        sqliteConn.Open();

        using var sqlConn = new SqlConnection(sqlServerConnString);
        sqlConn.Open();

        // 1. Roles
        CopyTable(sqliteConn, sqlConn, "Roles", new[] { "Id", "Name", "Description" }, isIdentity: true);

        // 2. Users
        CopyTable(sqliteConn, sqlConn, "Users", new[]
        {
            "Id", "FullName", "Email", "PhoneNumber", "PasswordHash", "RoleId",
            "AvatarUrl", "Bio", "Username", "IsEmailVerified", "IsPhoneVerified",
            "IsActive", "CreatedAt", "UpdatedAt"
        });

        // 3. Categories
        CopyTable(sqliteConn, sqlConn, "Categories", new[]
        {
            "Id", "Name", "Slug", "Description", "PillarColor", "AccentColor", "IsActive", "CreatedAt"
        });

        // 4. Tags
        CopyTable(sqliteConn, sqlConn, "Tags", new[] { "Id", "Name", "Slug", "CreatedAt" });

        // 5. Articles
        CopyTable(sqliteConn, sqlConn, "Articles", new[]
        {
            "Id", "Title", "Slug", "Summary", "Content", "FeaturedImageUrl", "ImageCaption",
            "Kicker", "ReadTime", "Status", "IsFeatured", "AuthorId", "CategoryId",
            "PublishedAt", "CreatedAt", "UpdatedAt", "ViewsCount", "LikesCount"
        });

        // 6. ArticleTags
        CopyTable(sqliteConn, sqlConn, "ArticleTags", new[] { "ArticleId", "TagId" });

        // 7. Comments
        CopyTable(sqliteConn, sqlConn, "Comments", new[]
        {
            "Id", "ArticleId", "UserId", "Content", "CreatedAt", "UpdatedAt"
        });

        // 8. Likes
        CopyTable(sqliteConn, sqlConn, "Likes", new[] { "Id", "ArticleId", "UserId", "CreatedAt" });

        // 9. Bookmarks
        CopyTable(sqliteConn, sqlConn, "Bookmarks", new[] { "Id", "ArticleId", "UserId", "CreatedAt" });

        // 10. ArticleViews
        CopyTable(sqliteConn, sqlConn, "ArticleViews", new[] { "Id", "ArticleId", "IpAddress", "UserId", "ViewedAt" });

        // 11. RefreshTokens
        CopyTable(sqliteConn, sqlConn, "RefreshTokens", new[]
        {
            "Id", "Token", "UserId", "ExpiresAt", "IsRevoked", "CreatedAt"
        });

        // 12. Images
        CopyTable(sqliteConn, sqlConn, "Images", new[]
        {
            "Id", "FileName", "FilePath", "Url", "ContentType", "FileSize", "Caption", "UploadedById", "CreatedAt"
        });

        // 13. OTPVerifications
        CopyTable(sqliteConn, sqlConn, "OTPVerifications", new[]
        {
            "Id", "Identifier", "OtpCode", "Purpose", "ExpiresAt", "IsUsed", "AttemptsCount", "CreatedAt"
        });

        Console.WriteLine("[MIGRATOR] Migration from SQLite to SQL Server completed successfully!");
    }

    private static void CopyTable(SqliteConnection sqliteConn, SqlConnection sqlConn, string tableName, string[] columns, bool isIdentity = false)
    {
        // Check if destination table already has rows
        using var countCmd = new SqlCommand($"SELECT COUNT(*) FROM [{tableName}]", sqlConn);
        var existingCount = (int)countCmd.ExecuteScalar()!;
        if (existingCount > 0)
        {
            Console.WriteLine($"[MIGRATOR] Table [{tableName}] already has {existingCount} rows in SQL Server. Skipping.");
            return;
        }

        var colList = string.Join(", ", columns.Select(c => $"[{c}]"));
        var paramList = string.Join(", ", columns.Select(c => $"@{c}"));

        using var selectCmd = new SqliteCommand($"SELECT {colList} FROM [{tableName}]", sqliteConn);
        using var reader = selectCmd.ExecuteReader();

        var inserted = 0;

        if (isIdentity)
        {
            using var identOn = new SqlCommand($"SET IDENTITY_INSERT [{tableName}] ON", sqlConn);
            identOn.ExecuteNonQuery();
        }

        while (reader.Read())
        {
            using var insertCmd = new SqlCommand($"INSERT INTO [{tableName}] ({colList}) VALUES ({paramList})", sqlConn);
            for (int i = 0; i < columns.Length; i++)
            {
                var colName = columns[i];
                var val = reader.GetValue(i);

                if (val == DBNull.Value || val == null)
                {
                    insertCmd.Parameters.AddWithValue($"@{colName}", DBNull.Value);
                }
                else
                {
                    insertCmd.Parameters.AddWithValue($"@{colName}", val);
                }
            }
            insertCmd.ExecuteNonQuery();
            inserted++;
        }

        if (isIdentity)
        {
            using var identOff = new SqlCommand($"SET IDENTITY_INSERT [{tableName}] OFF", sqlConn);
            identOff.ExecuteNonQuery();
        }

        Console.WriteLine($"[MIGRATOR] Copied {inserted} rows into [{tableName}].");
    }
}

