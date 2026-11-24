import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wl_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('wl_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem('wl_access_token', data.accessToken);
          localStorage.setItem('wl_refresh_token', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('wl_access_token');
          localStorage.removeItem('wl_refresh_token');
          localStorage.removeItem('wl_user');
          window.location.href = '/signin';
        }
      }
    }
    return Promise.reject(err);
  }
);

// Auth endpoints
export const authApi = {
  signup: (data: object) => api.post('/auth/signup', data),
  login: (data: object) => api.post('/auth/login', data),
  sendOtp: (data: object) => api.post('/auth/send-otp', data),
  verifyOtp: (data: object) => api.post('/auth/verify-otp', data),
  forgotPassword: (data: object) => api.post('/auth/forgot-password', data),
  resetPassword: (data: object) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
};

// Article endpoints
export const articlesApi = {
  getAll: (params?: object) => api.get('/articles', { params }),
  getFeatured: () => api.get('/articles/featured'),
  getPopular: () => api.get('/articles/popular'),
  getBySlug: (slug: string) => api.get(`/articles/slug/${slug}`),
  getById: (id: string) => api.get(`/articles/${id}`),
  create: (data: object) => api.post('/articles', data),
  update: (id: string, data: object) => api.put(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  changeStatus: (id: string, status: string) => api.patch(`/articles/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getComments: (id: string) => api.get(`/articles/${id}/comments`),
  addComment: (id: string, content: string) => api.post(`/articles/${id}/comments`, { content }),
  deleteComment: (articleId: string, commentId: string) => api.delete(`/articles/${articleId}/comments/${commentId}`),
  toggleLike: (id: string) => api.post(`/articles/${id}/like`),
  toggleBookmark: (id: string) => api.post(`/articles/${id}/bookmark`),
  publishWithPayment: (id: string, data: object) => api.post(`/articles/${id}/publish-payment`, data),
};

// Categories endpoints
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: object) => api.post('/categories', data),
  update: (id: string, data: object) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Tags endpoints
export const tagsApi = {
  getAll: () => api.get('/tags'),
  create: (name: string) => api.post('/tags', { name }),
};

// Images endpoints
export const imagesApi = {
  upload: (file: File, caption?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (caption) form.append('caption', caption);
    return api.post('/images/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Bookmarks
export const bookmarksApi = {
  getMyBookmarks: (params?: object) => api.get('/bookmarks/my', { params }),
};

// Authors
export const authorsApi = {
  getProfile: (username: string) => api.get(`/authors/${username}`),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: object) => api.get('/admin/users', { params }),
  updateRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  updateStatus: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}/status`, { isActive }),
  getArticles: (params?: object) => api.get('/admin/articles', { params }),
};

// Payments & Subscriptions
export const paymentsApi = {
  contribute: (data: object) => api.post('/payments/contribute', data),
  subscribe: (data: object) => api.post('/payments/subscribe', data),
  getSubscriptionStatus: () => api.get('/payments/subscription-status'),
  getAllPayments: (params?: object) => api.get('/payments/all', { params }),
};

// Live & Breaking News
export const newsApi = {
  getAll: (params?: { category?: string; isBreaking?: boolean; isLive?: boolean; limit?: number }) =>
    api.get('/news', { params }),
  getBreaking: () => api.get('/news/breaking'),
  create: (data: object) => api.post('/news', data),
  update: (id: string, data: object) => api.put(`/news/${id}`, data),
  delete: (id: string) => api.delete(`/news/${id}`),
};

export default api;

