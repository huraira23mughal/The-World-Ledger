import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { bookmarksApi } from '../api/client';
import ArticleCard from '../components/ArticleCard';
import type { Article } from '../types';

export default function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookmarksApi.getMyBookmarks()
      .then(({ data }) => setArticles(data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 border-b-4 border-[#052962] pb-4 mb-8">
        <Bookmark className="text-[#052962]" size={32} />
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#052962]">Saved Articles</h1>
          <p className="text-gray-500 text-sm">Your personal reading library</p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded max-w-xl mx-auto">
          <Bookmark size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-serif text-xl font-bold text-[#052962] mb-2">No saved articles yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            When you find stories you want to read later, tap the bookmark icon on any article to save it here.
          </p>
          <Link
            to="/"
            className="bg-[#052962] text-white px-6 py-2.5 text-sm font-semibold hover:bg-blue-900 rounded transition-colors"
          >
            Explore Articles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(a => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      )}
    </main>
  );
}

