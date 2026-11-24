import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Zap, Clock, RefreshCw, Globe, Flag, TrendingUp, Cpu, Trophy } from 'lucide-react';
import { newsApi } from '../api/client';
import type { LiveNewsItem } from '../types';

const CATEGORIES = ['All', 'World', 'Pakistan', 'Business', 'Sports', 'Technology'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  World: <Globe size={14} />,
  Pakistan: <Flag size={14} />,
  Business: <TrendingUp size={14} />,
  Sports: <Trophy size={14} />,
  Technology: <Cpu size={14} />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsCornerPage() {
  const [items, setItems] = useState<LiveNewsItem[]>([]);
  const [breaking, setBreaking] = useState<LiveNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : {};
      const [newsRes, breakingRes] = await Promise.all([
        newsApi.getAll({ ...params, isLive: true }),
        newsApi.getBreaking(),
      ]);
      setItems(newsRes.data || []);
      setBreaking(breakingRes.data || null);
      setLastRefreshed(new Date());
    } catch {
      // fail silently on refresh
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchNews(true), 60000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="border-b-4 border-[#052962] pb-4 mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={18} className="text-red-600 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-red-600">Live</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#052962]">News Corner</h1>
          <p className="text-gray-500 text-sm mt-1">Continuously updated · Breaking news · Live coverage</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Refreshed {timeAgo(lastRefreshed.toISOString())}
          </span>
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Breaking News Banner */}
      {breaking && (
        <div className="bg-red-600 text-white rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5">
            <Zap size={18} className="text-yellow-300" />
          </span>
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-yellow-300 mr-2">Breaking</span>
            <span className="font-semibold text-sm">{breaking.title}</span>
            <p className="text-red-100 text-xs mt-1 leading-relaxed">{breaking.content}</p>
            <div className="flex items-center gap-3 mt-1.5 text-red-200 text-xs">
              <span>{breaking.source}</span>
              <span>·</span>
              <span>{timeAgo(breaking.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-full border transition ${
              activeCategory === cat
                ? 'bg-[#052962] text-white border-[#052962]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#052962] hover:text-[#052962]'
            }`}
          >
            {cat !== 'All' && CATEGORY_ICONS[cat]}
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse border border-gray-100 rounded-lg p-5">
              <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <Radio size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-semibold">No live news in this category right now.</p>
          <p className="text-sm mt-1">Check back soon — we update every minute.</p>
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 hover:bg-gray-50 transition ${idx === 0 ? 'bg-blue-50/40' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Timeline dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isBreaking ? 'bg-red-500' : 'bg-[#052962]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {item.isBreaking && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                        <Zap size={9} /> Breaking
                      </span>
                    )}
                    {item.isLive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase bg-green-600 text-white px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                      {CATEGORY_ICONS[item.category]}
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-[#052962] text-lg leading-snug mb-1.5">
                    {item.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.content}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{item.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {timeAgo(item.createdAt)}
                    </span>
                    {item.updatedAt && (
                      <>
                        <span>·</span>
                        <span>Updated {timeAgo(item.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-8">
        News Corner auto-refreshes every 60 seconds ·{' '}
        <Link to="/" className="text-[#052962] hover:underline">Back to Home</Link>
      </p>
    </main>
  );
}

