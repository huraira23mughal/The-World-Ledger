import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, MessageSquare } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'compact' | 'list';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const categoryColor = article.category?.pillarColor || '#052962';

  if (variant === 'hero') {
    return (
      <article className="group relative h-full">
        {article.featuredImageUrl && (
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}
        <div className={article.featuredImageUrl ? 'absolute bottom-0 left-0 right-0 p-6 text-white' : 'p-6'}>
          {article.kicker && (
            <span className="text-xs font-bold tracking-widest uppercase mb-2 block" style={{ color: '#ffe500' }}>
              {article.kicker}
            </span>
          )}
          <Link to={`/article/${article.slug}`}>
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight hover:underline mb-2">
              {article.title}
            </h2>
          </Link>
          <p className="text-sm opacity-80 line-clamp-2 mb-3">{article.summary}</p>
          <div className="flex items-center gap-3 text-xs opacity-70">
            <Link to={`/author/${article.author?.username}`} className="hover:underline">
              {article.author?.name}
            </Link>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
            <Link to={`/category/${article.category?.slug}`} className="hover:underline capitalize">
              {article.category?.name}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="flex gap-3 group border-b border-gray-100 pb-3 last:border-0 last:pb-0">
        {article.featuredImageUrl && (
          <Link to={`/article/${article.slug}`} className="shrink-0">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-20 h-16 object-cover group-hover:opacity-90 transition-opacity"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: categoryColor }}>
            {article.category?.name}
          </span>
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-serif text-sm font-bold leading-snug hover:text-[#052962] line-clamp-3 mt-0.5">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1">{article.timeAgo || 'Recently'}</p>
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className="flex gap-4 group py-4 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: categoryColor }}>
            {article.category?.name}
          </span>
          {article.kicker && (
            <p className="text-xs text-gray-500 mt-0.5">{article.kicker}</p>
          )}
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-serif text-lg font-bold leading-snug hover:text-[#052962] mt-1">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.summary}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
            <Link to={`/author/${article.author?.username}`} className="text-gray-600 hover:underline">
              {article.author?.name}
            </Link>
            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {article.viewsCount}</span>
          </div>
        </div>
        {article.featuredImageUrl && (
          <Link to={`/article/${article.slug}`} className="shrink-0">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-32 h-24 object-cover group-hover:opacity-90 transition-opacity"
            />
          </Link>
        )}
      </article>
    );
  }

  // Standard card
  return (
    <article className="group border-b border-gray-100 pb-5 last:border-0">
      {article.featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="block mb-3">
          <div className="overflow-hidden aspect-[16/9]">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: categoryColor }}>
          {article.category?.name}
        </span>
        {article.kicker && <span className="text-xs text-gray-400">· {article.kicker}</span>}
      </div>
      <Link to={`/article/${article.slug}`}>
        <h3 className="font-serif text-xl font-bold leading-snug hover:text-[#052962] hover:underline mb-2">
          {article.title}
        </h3>
      </Link>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <Link to={`/author/${article.author?.username}`} className="text-gray-600 hover:underline font-medium">
          {article.author?.name}
        </Link>
        <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
        <span className="flex items-center gap-1"><Heart size={11} /> {article.likesCount}</span>
        <span className="flex items-center gap-1"><MessageSquare size={11} /> {article.commentsCount}</span>
      </div>
    </article>
  );
}

