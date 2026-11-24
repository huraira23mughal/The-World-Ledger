import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesApi, categoriesApi } from '../api/client';
import ArticleCard from '../components/ArticleCard';
import type { Article, Category } from '../types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setPage(1);

    Promise.allSettled([
      categoriesApi.getBySlug(slug),
      articlesApi.getAll({ category: slug, page: 1, pageSize }),
    ]).then(([catRes, artRes]) => {
      if (catRes.status === 'fulfilled') setCategory(catRes.value.data);
      if (artRes.status === 'fulfilled') {
        setArticles(artRes.value.data.articles || []);
        setTotal(artRes.value.data.totalCount || 0);
      }
      setLoading(false);
    });
  }, [slug]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const { data } = await articlesApi.getAll({ category: slug, page: nextPage, pageSize });
    setArticles(prev => [...prev, ...(data.articles || [])]);
    setPage(nextPage);
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pillarColor = category?.pillarColor || '#052962';

  return (
    <main>
      {/* Category masthead */}
      <div className="border-b-4" style={{ borderColor: pillarColor }}>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <h1 className="font-serif text-4xl font-bold" style={{ color: pillarColor }}>
            {category?.name || slug}
          </h1>
          {category?.description && (
            <p className="text-gray-600 mt-2 max-w-2xl">{category.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">{total} article{total !== 1 ? 's' : ''} published</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {articles.length === 0 ? (
          // Clean empty state
          <div className="py-20 text-center max-w-xl mx-auto">
            <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: pillarColor }} />
            <h2 className="font-serif text-2xl font-bold text-[#052962] mb-4">No articles published yet</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              This section is ready for editorial submissions. No articles have been published in{' '}
              <strong>{category?.name || slug}</strong> yet. Registered authors and our editorial team are working on
              bringing you the finest journalism in this category.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signup?role=author"
                className="inline-block px-6 py-2.5 font-semibold text-sm text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: pillarColor }}
              >
                Become an Author
              </Link>
              <Link
                to="/"
                className="inline-block px-6 py-2.5 font-semibold text-sm border-2 text-[#052962] hover:bg-gray-50 transition-colors"
                style={{ borderColor: pillarColor }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-1">
              {articles.map(a => (
                <ArticleCard key={a.id} article={a} variant="list" />
              ))}
              {articles.length < total && (
                <button
                  onClick={loadMore}
                  className="mt-6 w-full border-2 border-[#052962] text-[#052962] py-3 font-semibold text-sm hover:bg-[#052962] hover:text-white transition-all"
                >
                  Load more articles
                </button>
              )}
            </div>
            <aside>
              <div className="p-4 border-t-4" style={{ borderColor: pillarColor }}>
                <h3 className="font-serif text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: pillarColor }}>
                  About This Section
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{category?.description}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

