import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { articlesApi, categoriesApi } from '../api/client';
import ArticleCard from '../components/ArticleCard';
import type { Article, Category } from '../types';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const tagFilter = params.get('tag') || '';
  const [query, setQuery] = useState(q);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (!q && !tagFilter) return;
    setLoading(true);
    articlesApi.getAll({ search: q || undefined, tag: tagFilter || undefined, category: catFilter || undefined, page: 1, pageSize: 20 })
      .then(({ data }) => {
        setArticles(data.articles || []);
        setTotal(data.totalCount || 0);
      })
      .finally(() => setLoading(false));
  }, [q, tagFilter, catFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(query ? { q: query } : {});
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-[#052962] mb-6">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, topics, authors..."
            className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
          />
        </div>
        <button type="submit" className="bg-[#052962] text-white px-6 py-3 text-sm font-semibold hover:bg-blue-900 transition-colors rounded">
          Search
        </button>
      </form>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCatFilter('')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${!catFilter ? 'bg-[#052962] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.slice(0, 10).map(cat => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(catFilter === cat.slug ? '' : cat.slug)}
            className={`px-3 py-1.5 text-xs font-semibold rounded ${catFilter === cat.slug ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            style={catFilter === cat.slug ? { backgroundColor: cat.pillarColor } : {}}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {tagFilter && (
        <div className="mb-4">
          <span className="text-sm text-gray-500">Filtering by tag: </span>
          <span className="text-sm font-semibold text-[#052962] border border-[#052962] px-2 py-0.5 rounded">{tagFilter}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !q && !tagFilter ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-serif text-lg">Enter a search term to find articles</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-gray-500 mb-2">No articles found</p>
          <p className="text-gray-400 text-sm">Try different keywords or browse our sections</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">{total} result{total !== 1 ? 's' : ''} {q ? `for "${q}"` : ''}</p>
          <div className="space-y-1">
            {articles.map(a => <ArticleCard key={a.id} article={a} variant="list" />)}
          </div>
        </>
      )}
    </main>
  );
}

