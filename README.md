# The World Ledger

> An independent, Guardian-inspired broadsheet and multi-author article publishing web platform built with **ASP.NET Core Web API (C#)**, **Microsoft SQL Server 2025**, and a **React 19 + Vite + Tailwind CSS** frontend.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database & Relational Model](#database--relational-model)
- [Project Directory Structure](#project-directory-structure)
- [Frontend Routes & Pages (33 Pages)](#frontend-routes--pages-33-pages)
- [Backend REST API Endpoints](#backend-rest-api-endpoints)
- [Authentication & Roles](#authentication--roles)
- [Getting Started & Local Setup](#getting-started--local-setup)
- [Default Seed Data & Admin Credentials](#default-seed-data--admin-credentials)
- [License](#license)

---

## Overview

**The World Ledger** is an editorial news and magazine publishing website designed with a classic broadsheet aesthetic. It features real-time dynamic content delivery directly from a SQL Server database, user-contributed articles, editorial workflows, role-based governance, and rich community interaction (comments, likes, bookmarks, reading lists).

### Strict Content Principles
- **No dummy data**: Content displayed across home, category, and article pages is sourced dynamically from the database through verified contributor submissions.
- **Dynamic Category Handling**: Categories without published stories render a clean, professional *"No articles published yet"* state.
- **Editorial Integrity**: Full separation between drafts, pending editorial submissions, and published articles.

---

## Key Features

1. **Editorial & Publishing**
   - Rich text article creation and editing with image upload support.
   - Status transitions: `Draft`, `Published`, `Archived`.
   - Automatic reading-time estimation, kicker headers, standfirst summaries, and SEO-friendly slug generation.
   - Multi-category classification and tagging.

2. **Guardian-Inspired Navigation & Layout**
   - Multi-tier masthead with global edition date, utility shortcuts, and dynamic navigation.
   - **Primary Sections**: News, Opinion, Sport, Culture, Lifestyle, More.
   - **30 Sub-Categories**: World, US Politics, UK News, Climate Crisis, Middle East, Ukraine, Environment, Science, Global Development, Books, Music, Film, Football, Cricket, F1, Fashion, Food, Technology, Business, Obituaries, etc.
   - **Broadsheet Features**: Digital Archive, Today's Paper, Live Events, Mobile App portal, Crosswords & Word Games, Whistleblower Tips Desk, Audio & Video streams, and Newsletters.

3. **User Governance & Role-Based Access Control (RBAC)**
   - **Admin**: Full editorial console, category management, user access control, site analytics.
   - **Author**: Article drafting, submission, revisions, byline management, author profile analytics.
   - **Reader**: Bookmarks, comments, likes, subscriber newsletters, support passes.

4. **Security & Authentication**
   - Stateless JWT Bearer token authentication with sliding refresh tokens.
   - Password hashing via BCrypt (`BCrypt.Net-Next`).
   - OTP verification workflows for phone/email verification and password recovery.
   - Rate-limiting safeguards and cycle-safe foreign key constraints in SQL Server.

5. **Reader Support & Contributor Passes**
   - Integrated pricing passes: Pay-Per-Article submission, Monthly Author Contributor Pass, and Reader Supporter All-Access.
   - Interactive checkout with receipt generation.

---

## Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 | SPA with React Router DOM v7, Lucide Icons, Axios |
| **Backend** | ASP.NET Core Web API (C#) | .NET 10.0 runtime with clean 3-layer architecture |
| **Database** | Microsoft SQL Server 2025 | Default instance `MSSQLSERVER`, database `WorldLedgerDb` |
| **ORM** | Entity Framework Core 10.0 | Code-First with migrations (`InitialSqlServer`) |
| **Auth** | JWT + OTP | `Microsoft.AspNetCore.Authentication.JwtBearer`, BCrypt |

---

## Architecture

The backend strictly follows a **3-Layer Architecture**:

```
┌────────────────────────────────────────────────────────┐
│                   Controllers Layer                    │
│  (AuthController, ArticlesController, Categories, ...) │
└───────────────────────────┬────────────────────────────┘
                            │ DTOs & Request Validation
┌───────────────────────────▼────────────────────────────┐
│                    Services Layer                      │
│   (AuthService, ArticleService, InteractionService,    │
│    AdminService, ImageService, OTPService, JwtService) │
└───────────────────────────┬────────────────────────────┘
                            │ Domain Entities & Logic
┌───────────────────────────▼────────────────────────────┐
│                   Repositories Layer                   │
│          (UnitOfWork, Generic & Custom Repos)          │
└───────────────────────────┬────────────────────────────┘
                            │ Entity Framework Core 10
┌───────────────────────────▼────────────────────────────┐
│               Microsoft SQL Server 2025                │
│                    (WorldLedgerDb)                     │
└────────────────────────────────────────────────────────┘
```

---

## Database & Relational Model

The database contains **12 core relational tables** plus the EF migration history table:

| Table | Description | Primary Key | Key Relationships |
| :--- | :--- | :--- | :--- |
| `Users` | User profiles, credentials, verification status | `Id` (Guid) | FK to `Roles` |
| `Roles` | System access tiers: Admin (1), Author (2), Reader (3) | `Id` (int) | 1-to-many with `Users` |
| `Categories` | Guardian editorial sections and styling palettes | `Id` (Guid) | 1-to-many with `Articles` |
| `Tags` | Indexing tags for topical categorization | `Id` (Guid) | Many-to-many with `Articles` |
| `Articles` | Publishing manuscripts, content, kickers, stats | `Id` (Guid) | FK to `Users` (Author), FK to `Categories` |
| `ArticleTags` | Junction table for article tags | `(ArticleId, TagId)` | Composite PK |
| `Comments` | Reader discussions and editorial responses | `Id` (Guid) | FK to `Articles` (Cascade), FK to `Users` (No Action) |
| `Likes` | Unique user article likes | `Id` (Guid) | FK to `Articles` (Cascade), FK to `Users` (No Action) |
| `Bookmarks` | Reader personal reading list saves | `Id` (Guid) | FK to `Articles` (Cascade), FK to `Users` (No Action) |
| `ArticleViews` | Read analytics with IP & timestamp tracking | `Id` (Guid) | FK to `Articles` (Cascade), FK to `Users` (No Action) |
| `RefreshTokens` | Rotating JWT refresh tokens | `Id` (Guid) | FK to `Users` (Cascade) |
| `Images` | Metadata for uploaded media and photography | `Id` (Guid) | FK to `Users` (UploadedBy) |
| `OTPVerifications` | Temporary one-time passcode verification store | `Id` (Guid) | Indexed on `(Identifier, Purpose, IsUsed)` |

---

## Project Directory Structure

```
The World Ledger/
├── backend/
│   └── WorldLedger.API/
│       ├── Controllers/          # REST API endpoints
│       │   ├── AdminController.cs
│       │   ├── ArticlesController.cs
│       │   ├── AuthController.cs
│       │   ├── CategoriesController.cs
│       │   ├── ImagesController.cs
│       │   └── TagsController.cs
│       ├── Data/                 # EF DbContext, Seeder, and Data Migrator
│       │   ├── AppDbContext.cs
│       │   ├── DataMigrator.cs
│       │   └── DataSeeder.cs
│       ├── DTOs/                 # Request & response data transfer objects
│       │   ├── ArticleDtos.cs
│       │   ├── AuthDtos.cs
│       │   └── CategoryDtos.cs
│       ├── Entities/             # Core database entity models
│       ├── Migrations/           # EF Core SQL Server migrations
│       ├── Repositories/         # Repository pattern & Unit of Work
│       ├── Services/             # Business logic layer
│       ├── appsettings.json      # Connection strings & configuration
│       ├── Program.cs            # Dependency injection & pipeline setup
│       └── worldledger.db        # Preserved SQLite database file
│
├── frontend/                     # Unified React + Vite + Tailwind CSS app
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts         # Central Axios client with JWT interceptor
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx        # Guardian-style multi-tier navigation
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # React Authentication & User context
│   │   ├── pages/                # All 33 application pages
│   │   │   ├── AboutPage.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AppsPage.tsx
│   │   │   ├── ArchivePage.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   ├── AudioVideoPage.tsx
│   │   │   ├── AuthorProfilePage.tsx
│   │   │   ├── BookmarksPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── CrosswordsPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── HolidaysPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LicensingPage.tsx
│   │   │   ├── LiveEventsPage.tsx
│   │   │   ├── NewslettersPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── PrivacyPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   ├── SectionPage.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── SubmitTipsPage.tsx
│   │   │   ├── SubscriptionsPage.tsx
│   │   │   ├── SupportPage.tsx
│   │   │   ├── TermsPage.tsx
│   │   │   ├── TodaysPaperPage.tsx
│   │   │   ├── VerifyOtpPage.tsx
│   │   │   └── WriteArticlePage.tsx
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── App.tsx               # Client routes & layout shell
│   │   ├── index.css             # Tailwind CSS imports & global styles
│   │   └── main.tsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## Frontend Routes & Pages (33 Pages)

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Front page edition with featured headlines and category blocks |
| `/section/:slug` | `SectionPage` | High-level pillar page (News, Opinion, Sport, Culture, Lifestyle, More) |
| `/category/:slug` | `CategoryPage` | Dynamic category feed filtering articles by sub-category |
| `/article/:slug` | `ArticlePage` | Full article reader with likes, bookmarks, and reader comments |
| `/search` | `SearchPage` | Full-text keyword and category search |
| `/write` | `WriteArticlePage` | Author editor for drafting and publishing stories |
| `/edit/:id` | `WriteArticlePage` | Author/Admin editor for updating existing articles |
| `/bookmarks` | `BookmarksPage` | Authenticated user saved reading list |
| `/author/:username` | `AuthorProfilePage` | Public author byline profile with published article index |
| `/admin` | `AdminDashboard` | Editorial management, user roles, stats, and category controls |
| `/signin` | `SignInPage` | User login via email/phone and password |
| `/signup` | `SignUpPage` | Registration with role selection and phone/email verification |
| `/verify-otp` | `VerifyOtpPage` | OTP entry and resend interface |
| `/forgot-password` | `ForgotPasswordPage` | Account recovery request via email or SMS |
| `/reset-password` | `ResetPasswordPage` | Secure password reset with verification token |
| `/pricing` | `PricingPage` | Publishing passes, contributor memberships, and reader tiers |
| `/checkout` | `CheckoutPage` | Payment processing and pass activation |
| `/profile` | `ProfilePage` | Account settings, 2FA toggle, and receipt archive |
| `/contact` | `ContactPage` | Newsroom directory and editorial contact form |
| `/privacy` | `PrivacyPage` | GDPR & CCPA privacy documentation |
| `/terms` | `TermsPage` | Contributor agreement and community standards |
| `/support` | `SupportPage` | Independent journalism support appeal |
| `/subscriptions` | `SubscriptionsPage` | Print and digital newspaper subscription options |
| `/crosswords` | `CrosswordsPage` | Daily crosswords, cryptic puzzles, and word games |
| `/submit-tips` | `SubmitTipsPage` | Secure whistleblower and confidential leak portal |
| `/about` | `AboutPage` | The World Ledger history, mission, and masthead |
| `/audio-video` | `AudioVideoPage` | Investigative podcasts, documentaries, and news video |
| `/newsletters` | `NewslettersPage` | Daily and weekly curated editorial briefings |
| `/todays-paper` | `TodaysPaperPage` | Digital facsimile and section breakdown of the print broadsheet |
| `/archive` | `ArchivePage` | Historic archive explorer dating back across editions |
| `/holidays` | `HolidaysPage` | Cultural travel, expeditions, and holiday guides |
| `/licensing` | `LicensingPage` | Commercial syndication, reprints, and copyright permissions |
| `/events` | `LiveEventsPage` | Live editorial debates, book festivals, and public summits |
| `/apps` | `AppsPage` | Mobile edition showcase for iOS and Android |

---

## Backend REST API Endpoints

### Health Check
- `GET /api/health` — API health status and connected database provider.

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register new user.
- `POST /api/auth/login` — Sign in with email or phone + password.
- `POST /api/auth/send-otp` — Dispatch OTP code via email/SMS.
- `POST /api/auth/verify-otp` — Verify code and complete login/registration.
- `POST /api/auth/forgot-password` — Request password reset code.
- `POST /api/auth/reset-password` — Apply new password with verified token.
- `POST /api/auth/refresh-token` — Rotate expired JWT using refresh token.
- `GET /api/auth/me` — Return current authenticated user profile (`[Authorize]`).

### Articles (`/api/articles`)
- `GET /api/articles` — Paginated articles list with category, tag, and search filtering.
- `GET /api/articles/featured` — Top featured editorial stories.
- `GET /api/articles/popular` — Most-viewed articles.
- `GET /api/articles/slug/{slug}` — Full article detail by slug.
- `GET /api/articles/{id}` — Article detail by ID.
- `POST /api/articles` — Create article (`Author`, `Admin`).
- `PUT /api/articles/{id}` — Update article (`Author`, `Admin`).
- `DELETE /api/articles/{id}` — Delete article (`Author`, `Admin`).
- `PATCH /api/articles/{id}/status` — Change status: Draft / Published / Archived (`Admin`).
- `GET /api/articles/{id}/comments` — Retrieve article comments.
- `POST /api/articles/{id}/comments` — Add comment (`[Authorize]`).
- `DELETE /api/articles/{articleId}/comments/{commentId}` — Delete comment (`Admin` or author).
- `POST /api/articles/{id}/like` — Toggle article like (`[Authorize]`).
- `POST /api/articles/{id}/bookmark` — Toggle article bookmark (`[Authorize]`).

### Categories (`/api/categories`)
- `GET /api/categories` — List all active editorial categories.
- `GET /api/categories/{slug}` — Retrieve category by slug.
- `POST /api/categories` — Create category (`Admin`).
- `PUT /api/categories/{id}` — Update category (`Admin`).
- `DELETE /api/categories/{id}` — Remove category (`Admin`).

### Tags (`/api/tags`)
- `GET /api/tags` — List all tags.
- `POST /api/tags` — Create tag (`Author`, `Admin`).

### Media (`/api/images`)
- `POST /api/images/upload` — Upload article image (multipart form, `Author`, `Admin`).

### Administration (`/api/admin`)
- `GET /api/admin/stats` — High-level statistics (total articles, users, views, comments).
- `GET /api/admin/users` — Paginated user directory.
- `PATCH /api/admin/users/{id}/role` — Update user role (`Admin`).
- `PATCH /api/admin/users/{id}/status` — Enable/disable account (`Admin`).

---

## Authentication & Roles

The system uses standard JWT tokens passed in the `Authorization: Bearer <token>` header:

- **Admin** (`RoleId: 1`): Full access to administrative metrics, user role elevation, and editorial controls.
- **Author** (`RoleId: 2`): Write, revise, and publish articles, manage tags, and review reader feedback.
- **Reader** (`RoleId: 3`): Read articles, comment on stories, like, bookmark, and manage subscriptions.

---

## Getting Started & Local Setup

### Prerequisites
- **.NET 10 SDK** (or .NET 9+ SDK)
- **Node.js** (v20 or newer) & **npm**
- **Microsoft SQL Server 2025** (Developer / Express edition) running locally

---

### Step 1: Run the Backend (ASP.NET Core Web API)

1. Open PowerShell and navigate to the backend project:
   ```powershell
   cd "d:\huraira\The World Ledger\backend\WorldLedger.API"
   ```
2. Run the application:
   ```powershell
   dotnet run --urls "http://localhost:5000"
   ```
3. The API will automatically apply EF Core migrations, run initial seeders, and start listening:
   ```text
   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   Application started. Press Ctrl+C to shut down.
   ```
4. Verify the backend connection in your browser:
   👉 **[http://localhost:5000/api/health](http://localhost:5000/api/health)**  
   *(Expected response includes `"provider": "SqlServer"`)*

---

### Step 2: Run the Frontend (React + Vite + Tailwind CSS)

1. Open a **second** PowerShell window:
   ```powershell
   cd "d:\huraira\The World Ledger\frontend"
   ```
2. Start the Vite development server:
   ```powershell
   npm run dev
   ```
3. The client will be ready instantly:
   ```text
     VITE v8.3.8  ready in 750 ms

     ➜  Local:   http://localhost:5173/
   ```

---

### Step 3: Open in Browser

Visit **[http://localhost:5173](http://localhost:5173)** in any browser.

---

## Default Seed Data & Admin Credentials

When the backend starts up against an empty or freshly migrated SQL Server database, it automatically provisions the base roles, the 30 Guardian sections, and the default system administrator:

- **Email:** `admin@theworldledger.com`
- **Password:** `Admin@123456!`
- **Role:** `Admin`
- **Full Name:** Eleanor Vance (Chief Editor)
- **Username:** `eleanor-vance`

---

## License

This project is licensed under the MIT License — feel free to use and extend it for your publishing needs.

