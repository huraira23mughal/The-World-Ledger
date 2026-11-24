export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  username?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isSubscribed?: boolean;
  subscriptionExpiresAt?: string;
  subscriptionPlan?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImageUrl?: string;
  imageCaption?: string;
  kicker?: string;
  readTime: string;
  status: string;
  isFeatured: boolean;
  isPremium?: boolean;
  isPaid?: boolean;
  publishingFee?: number;
  isPaywalled?: boolean;
  publishedAt?: string;
  createdAt: string;
  timeAgo: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  isBookmarkedByCurrentUser: boolean;
  author: AuthorSummary;
  category: CategorySummary;
  tags: Tag[];
  comments?: Comment[];
}

export interface AuthorSummary {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  pillarColor: string;
  accentColor: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  pillarColor: string;
  accentColor: string;
  articlesCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articlesCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  content: string;
  createdAt: string;
  timeAgo: string;
  user: User;
}

export interface ArticleList {
  articles: Article[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalReaders: number;
  totalSubscribers: number;
  totalRevenue: number;
  totalLiveNews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  categoriesOverview: Category[];
  recentArticles: Article[];
}

export interface LiveNewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  isBreaking: boolean;
  isLive: boolean;
  createdAt: string;
  updatedAt?: string;
}

