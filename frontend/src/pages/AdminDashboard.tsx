import React, { useState, useEffect } from 'react';
import { adminApi, newsApi } from '../api/client';
import type { DashboardStats, Article, User, LiveNewsItem } from '../types';
import { Users, FileText, Eye, MessageSquare, TrendingUp, Shield, Ban, CheckCircle, Radio, Zap, Plus, Trash2, Edit3 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [liveNews, setLiveNews] = useState<LiveNewsItem[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'articles' | 'categories' | 'live-news'>('overview');
  const [loading, setLoading] = useState(true);

  // Live news form state
  const [newsForm, setNewsForm] = useState({ title: '', content: '', source: '', category: 'World', isBreaking: false, isLive: true });
  const [newsError, setNewsError] = useState('');
  const [newsSaving, setNewsSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.getStats(),
      adminApi.getUsers(),
      adminApi.getArticles(),
      newsApi.getAll(),
    ]).then(([sRes, uRes, aRes, nRes]) => {
      setStats(sRes.data);
      setUsers(uRes.data);
      setArticles(aRes.data);
      setLiveNews(nRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    await adminApi.updateRole(userId, role);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    await adminApi.updateStatus(userId, isActive);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive } : u));
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsError('');
    if (!newsForm.title.trim() || !newsForm.content.trim()) return setNewsError('Title and content are required.');
    setNewsSaving(true);
    try {
      const { data } = await newsApi.create(newsForm);
      setLiveNews(prev => [data, ...prev]);
      setNewsForm({ title: '', content: '', source: '', category: 'World', isBreaking: false, isLive: true });
    } catch (err: any) {
      setNewsError(err.response?.data?.message || 'Failed to create news item.');
    } finally {
      setNewsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await newsApi.delete(id);
      setLiveNews(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const handleToggleBreaking = async (item: LiveNewsItem) => {
    try {
      const { data } = await newsApi.update(item.id, { ...item, isBreaking: !item.isBreaking });
      setLiveNews(prev => prev.map(n => n.id === item.id ? data : n));
    } catch {}
  };

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
      <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 mt-4">Loading admin dashboard...</p>
    </div>
  );

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-8 border-b-4 border-[#052962] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#052962]">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Editorial command centre — The World Ledger</p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#052962' },
            { label: 'Published Articles', value: stats.publishedArticles, icon: FileText, color: '#22874d' },
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#005689' },
            { label: 'Comments', value: stats.totalComments, icon: MessageSquare, color: '#7d0068' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 p-5 rounded shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{stat.label}</span>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Additional stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Authors</p>
            <p className="text-xl font-bold text-[#052962]">{stats.totalAuthors}</p>
          </div>
          <div className="bg-green-50 border border-green-100 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Subscribers</p>
            <p className="text-xl font-bold text-[#22874d]">{stats.totalSubscribers ?? stats.totalReaders}</p>
          </div>
          <div className="bg-red-50 border border-red-100 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Live News Items</p>
            <p className="text-xl font-bold text-red-600">{stats.totalLiveNews ?? liveNews.length}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-4 flex-wrap">
        {(['overview', 'users', 'articles', 'categories', 'live-news'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === t ? 'border-[#052962] text-[#052962]' : 'border-transparent text-gray-500 hover:text-[#052962]'
            }`}
          >
            {t === 'live-news' && <Radio size={13} className={tab === 'live-news' ? 'text-red-500' : ''} />}
            {t === 'live-news' ? 'Live News' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div>
          <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">Recent Articles</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Title</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Author</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Category</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentArticles.map(a => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-[#052962] max-w-xs truncate">{a.title}</td>
                    <td className="py-3 text-gray-600">{a.author?.name}</td>
                    <td className="py-3 text-gray-500">{a.category?.name}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-3 text-gray-500">{a.viewsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">User</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Role</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Joined</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-[#052962]">{u.fullName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#052962]"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Author">Author</option>
                        <option value="Reader">Reader</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleStatusToggle(u.id, !u.isActive)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          u.isActive
                            ? 'text-red-600 hover:bg-red-50 border border-red-200'
                            : 'text-green-600 hover:bg-green-50 border border-green-200'
                        }`}
                      >
                        {u.isActive ? <><Ban size={12} /> Ban</> : <><CheckCircle size={12} /> Unban</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div>
          <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">All Articles</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Title</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Author</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Section</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 max-w-xs">
                      <p className="font-medium text-[#052962] truncate">{a.title}</p>
                    </td>
                    <td className="py-3 text-gray-600 text-xs">{a.author?.name}</td>
                    <td className="py-3 text-gray-500 text-xs">{a.category?.name}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.status === 'Published' ? 'bg-green-100 text-green-700' :
                        a.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-3 text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'categories' && stats && (
        <div>
          <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">Section Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.categoriesOverview.map(cat => (
              <div key={cat.id} className="border-t-4 p-4 bg-white shadow-sm" style={{ borderColor: cat.pillarColor }}>
                <h3 className="font-bold text-sm text-[#052962]">{cat.name}</h3>
                <p className="text-2xl font-bold mt-1" style={{ color: cat.pillarColor }}>{cat.articlesCount}</p>
                <p className="text-xs text-gray-400">published articles</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIVE NEWS TAB ── */}
      {tab === 'live-news' && (
        <div className="space-y-8">
          {/* Add news form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-4 flex items-center gap-2">
              <Plus size={18} /> Add Live News Item
            </h2>
            <form onSubmit={handleAddNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={e => setNewsForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-[#052962] focus:outline-none"
                    placeholder="Breaking news headline..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={newsForm.source}
                    onChange={e => setNewsForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-[#052962] focus:outline-none"
                    placeholder="World Ledger Desk"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Content *</label>
                <textarea
                  value={newsForm.content}
                  onChange={e => setNewsForm(f => ({ ...f, content: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-[#052962] focus:outline-none resize-none"
                  placeholder="News summary..."
                  required
                />
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newsForm.category}
                    onChange={e => setNewsForm(f => ({ ...f, category: e.target.value }))}
                    className="border border-gray-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-[#052962] focus:outline-none"
                  >
                    {['World', 'Pakistan', 'Business', 'Sports', 'Technology'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={newsForm.isBreaking}
                    onChange={e => setNewsForm(f => ({ ...f, isBreaking: e.target.checked }))}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm font-semibold text-red-700 flex items-center gap-1">
                    <Zap size={13} /> Breaking News
                  </span>
                </label>
              </div>
              {newsError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{newsError}</p>}
              <button
                type="submit"
                disabled={newsSaving}
                className="bg-[#052962] text-white px-6 py-2.5 text-sm font-bold rounded hover:bg-blue-900 disabled:opacity-50 flex items-center gap-2"
              >
                {newsSaving ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Radio size={14} />}
                Publish News Item
              </button>
            </form>
          </div>

          {/* Live news list */}
          <div>
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">
              All Live News <span className="text-sm font-normal text-gray-500">({liveNews.length} items)</span>
            </h2>
            <div className="space-y-3">
              {liveNews.length === 0 ? (
                <p className="text-gray-400 text-sm italic py-8 text-center">No live news items yet.</p>
              ) : liveNews.map(item => (
                <div key={item.id} className={`border rounded-lg p-4 flex items-start gap-3 ${item.isBreaking ? 'border-red-200 bg-red-50/40' : 'border-gray-100 bg-white'}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.isBreaking ? 'bg-red-500' : 'bg-[#052962]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.isBreaking && (
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap size={8} /> Breaking
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-medium">{item.category}</span>
                      <span className="text-xs text-gray-400">· {item.source}</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBreaking(item)}
                      title={item.isBreaking ? 'Remove Breaking' : 'Mark Breaking'}
                      className={`p-1.5 rounded border text-xs font-semibold transition ${
                        item.isBreaking
                          ? 'border-red-300 text-red-600 hover:bg-red-50'
                          : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-600'
                      }`}
                    >
                      <Zap size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="p-1.5 rounded border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-600 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

