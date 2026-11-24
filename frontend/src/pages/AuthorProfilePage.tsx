import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authorsApi } from '../api/client';
import ArticleCard from '../components/ArticleCard';
import type { Article } from '../types';

export default function AuthorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    authorsApi.getProfile(username)
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#052962] mb-3">Author Not Found</h1>
        <p className="text-gray-500 mb-6">We could not find an author profile matching @{username}.</p>
        <Link to="/" className="text-[#052962] font-semibold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const { author, articles, totalArticles, totalViews, role } = profile;

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="border-b-4 border-[#052962] pb-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt={author.name} className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#052962] flex items-center justify-center text-white text-3xl font-serif font-bold">
              {author.name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-[#052962]">{author.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#052962] font-semibold">{role}</span>
            </div>
            {author.username && <p className="text-xs text-gray-400 mt-0.5">@{author.username}</p>}
            {author.bio && <p className="text-gray-700 mt-3 max-w-2xl leading-relaxed text-sm">{author.bio}</p>}
            <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
              <span><strong>{totalArticles}</strong> Published Articles</span>
              <span><strong>{totalViews.toLocaleString()}</strong> Cumulative Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Articles */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#052962] mb-6">Articles by {author.name}</h2>
        {articles.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">No articles published by this author yet.</p>
        ) : (
          <div className="space-y-2">
            {articles.map((a: Article) => (
              <ArticleCard key={a.id} article={a} variant="list" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

