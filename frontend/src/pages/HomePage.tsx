import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi, categoriesApi } from '../api/client';
import ArticleCard from '../components/ArticleCard';
import type { Article, Category } from '../types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [popular, setPopular] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, latestRes, popRes, catRes] = await Promise.allSettled([
          articlesApi.getFeatured(),
          articlesApi.getAll({ page: 1, pageSize: 12 }),
          articlesApi.getPopular(),
          categoriesApi.getAll(),
        ]);

        if (featRes.status === 'fulfilled') setFeatured(featRes.value.data);
        if (latestRes.status === 'fulfilled') setLatest(latestRes.value.data.articles || []);
        if (popRes.status === 'fulfilled') setPopular(popRes.value.data);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 mt-4 font-serif text-lg">Loading the latest dispatches...</p>
      </div>
    );
  }

  const hasContent = featured.length > 0 || latest.length > 0;

  return (
    <main>
      {/* Yellow accent bar */}
      <div className="h-1 bg-[#ffe500]" />

      {!hasContent ? (
        // Empty state - no articles yet
        <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-serif text-5xl font-bold text-[#052962] mb-6">The World Ledger</h1>
            <div className="w-16 h-1 bg-[#ffe500] mx-auto mb-8" />
            <p className="text-xl text-gray-600 mb-4 font-serif leading-relaxed">
              An independent international broadsheet committed to open, rigorous, and impartial journalism.
            </p>
            <p className="text-gray-500 mb-10 leading-relaxed">
              No articles have been published yet. Our editorial team and registered authors are preparing the first dispatches.
              Categories and sections are ready — content will appear here as authors publish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup?role=author"
                className="bg-[#052962] text-white px-8 py-3 font-semibold hover:bg-blue-900 transition-colors"
              >
                Become a Contributing Author
              </Link>
              <Link
                to="/signin"
                className="border-2 border-[#052962] text-[#052962] px-8 py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Category grid preview */}
          {categories.length > 0 && (
            <div className="mt-20">
              <h2 className="font-serif text-2xl font-bold text-[#052962] mb-8">Explore Our Sections</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 8).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="p-4 text-left border-t-4 hover:shadow-md transition-shadow bg-white"
                    style={{ borderColor: cat.pillarColor }}
                  >
                    <h3 className="font-bold text-sm text-[#052962]">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Featured articles */}
          {featured.length > 0 && (
            <section className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200 pb-10">
                {/* Hero */}
                <div className="md:col-span-2 border-r border-gray-200 pr-6">
                  <ArticleCard article={featured[0]} variant="hero" />
                </div>
                {/* Side stack */}
                <div className="space-y-4">
                  {featured.slice(1, 4).map(a => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Latest articles - main column */}
            <div className="md:col-span-2">
              <h2 className="font-serif text-xl font-bold text-[#052962] mb-4 pb-2 border-b-2 border-[#052962]">
                Latest
              </h2>
              <div className="space-y-1">
                {latest.map(a => (
                  <ArticleCard key={a.id} article={a} variant="list" />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              {popular.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-serif text-lg font-bold text-[#052962] mb-4 pb-2 border-b-2 border-[#ffe500]">
                    Most Read
                  </h2>
                  <ol className="space-y-4">
                    {popular.map((a, i) => (
                      <li key={a.id} className="flex gap-3">
                        <span className="text-3xl font-bold text-gray-200 font-serif leading-none w-8 shrink-0">{i + 1}</span>
                        <div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#052962]">{a.category?.name}</span>
                          <Link to={`/article/${a.slug}`} className="block font-serif text-sm font-bold hover:text-[#052962] hover:underline mt-0.5 leading-snug">
                            {a.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Categories */}
              <div>
                <h2 className="font-serif text-lg font-bold text-[#052962] mb-4 pb-2 border-b-2 border-[#052962]">
                  Sections
                </h2>
                <div className="space-y-1">
                  {categories.filter(c => c.articlesCount > 0).map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex justify-between items-center py-2 border-b border-gray-100 text-sm hover:text-[#052962] group"
                    >
                      <span className="font-medium group-hover:underline">{cat.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {cat.articlesCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

