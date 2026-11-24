import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Bookmark, Share2, Clock, Eye, MessageSquare, Loader2, Lock, Star } from 'lucide-react';
import { articlesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Article } from '../types';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    articlesApi.getBySlug(slug)
      .then(({ data }) => setArticle(data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated || !article) return;
    setLikeLoading(true);
    try {
      const { data } = await articlesApi.toggleLike(article.id);
      setArticle(a => a ? { ...a, isLikedByCurrentUser: data.isLiked, likesCount: data.likesCount } : a);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated || !article) return;
    setBookmarkLoading(true);
    try {
      const { data } = await articlesApi.toggleBookmark(article.id);
      setArticle(a => a ? { ...a, isBookmarkedByCurrentUser: data.isBookmarked } : a);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !article) return;
    setCommenting(true);
    try {
      const { data } = await articlesApi.addComment(article.id, comment.trim());
      setArticle(a => a ? { ...a, comments: [data, ...(a.comments || [])], commentsCount: (a.commentsCount || 0) + 1 } : a);
      setComment('');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
      <div className="inline-block w-8 h-8 border-4 border-[#052962] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-[#052962] mb-4">Article not found</h1>
      <Link to="/" className="text-[#052962] hover:underline">Return to home</Link>
    </div>
  );

  const categoryColor = article.category?.pillarColor || '#052962';

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-[#052962]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to={`/category/${article.category?.slug}`} className="font-semibold hover:underline" style={{ color: categoryColor }}>
            {article.category?.name}
          </Link>
        </div>

        {/* Article header */}
        <div className="border-t-4 pt-6 mb-8" style={{ borderColor: categoryColor }}>
          {article.kicker && (
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: categoryColor }}>
              {article.kicker}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#052962] leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 font-serif leading-relaxed mb-6">{article.summary}</p>

          {/* Byline */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-200">
            {article.author?.avatarUrl ? (
              <img src={article.author.avatarUrl} alt={article.author.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#052962] flex items-center justify-center text-white font-bold">
                {article.author?.name?.[0]}
              </div>
            )}
            <div>
              <Link to={`/author/${article.author?.username}`} className="font-semibold text-sm text-[#052962] hover:underline">
                {article.author?.name}
              </Link>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {article.viewsCount} views</span>
                {article.publishedAt && (
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {article.featuredImageUrl && (
          <div className="mb-8">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full object-cover max-h-[500px]"
            />
            {article.imageCaption && (
              <p className="text-xs text-gray-500 italic mt-2">{article.imageCaption}</p>
            )}
          </div>
        )}

        {/* Premium badge */}
        {article.isPremium && (
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              Premium Article
            </span>
          </div>
        )}

        {/* Article body — with paywall gate */}
        {article.isPaywalled ? (
          <>
            {/* Show teaser content */}
            <div
              className="prose prose-lg max-w-none font-serif prose-headings:font-serif prose-headings:text-[#052962] prose-a:text-[#052962] prose-blockquote:border-l-4 prose-blockquote:border-[#ffe500] mb-0"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            {/* Paywall blur overlay */}
            <div className="relative -mt-16">
              <div className="h-20 bg-gradient-to-b from-transparent to-white" />
              <div className="bg-white border border-amber-200 rounded-xl p-8 text-center shadow-lg">
                <Lock size={36} className="mx-auto mb-3 text-amber-500" />
                <h3 className="font-serif text-2xl font-bold text-[#052962] mb-2">
                  This is a Premium Article
                </h3>
                <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                  Subscribe to The World Ledger for <strong>$5/month</strong> to unlock full access to all premium
                  articles, in-depth investigations, and exclusive analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!user ? (
                    <>
                      <Link
                        to="/signup"
                        className="bg-[#052962] text-white px-6 py-2.5 text-sm font-bold rounded hover:bg-blue-900 transition"
                      >
                        Sign Up Free
                      </Link>
                      <Link
                        to="/signin"
                        className="border border-[#052962] text-[#052962] px-6 py-2.5 text-sm font-bold rounded hover:bg-blue-50 transition"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/checkout?plan=reader"
                      className="bg-amber-500 text-white px-8 py-2.5 text-sm font-bold rounded hover:bg-amber-600 transition"
                    >
                      Subscribe for $5/month →
                    </Link>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4">Cancel anytime · Secure payment</p>
              </div>
            </div>
          </>
        ) : (
          <div
            className="prose prose-lg max-w-none font-serif prose-headings:font-serif prose-headings:text-[#052962] prose-a:text-[#052962] prose-blockquote:border-l-4 prose-blockquote:border-[#ffe500] mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/search?tag=${tag.slug}`}
                className="text-xs px-3 py-1 border border-gray-300 text-gray-600 hover:border-[#052962] hover:text-[#052962] transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Interaction bar */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-200 mb-10">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated || likeLoading}
            className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors ${
              article.isLikedByCurrentUser
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {likeLoading ? <Loader2 size={14} className="animate-spin" /> : <Heart size={14} className={article.isLikedByCurrentUser ? 'fill-red-500' : ''} />}
            {article.likesCount}
          </button>

          <button
            onClick={handleBookmark}
            disabled={!isAuthenticated || bookmarkLoading}
            className={`flex items-center gap-2 px-4 py-2 text-sm border transition-colors ${
              article.isBookmarkedByCurrentUser
                ? 'bg-blue-50 border-blue-300 text-[#052962]'
                : 'border-gray-300 text-gray-600 hover:border-[#052962] hover:text-[#052962]'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {bookmarkLoading ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} className={article.isBookmarkedByCurrentUser ? 'fill-current' : ''} />}
            {article.isBookmarkedByCurrentUser ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-600 hover:border-[#052962] hover:text-[#052962] transition-colors"
          >
            <Share2 size={14} /> Share
          </button>

          <span className="ml-auto flex items-center gap-1 text-sm text-gray-400">
            <MessageSquare size={14} /> {article.commentsCount || 0} comments
          </span>
        </div>

        {/* Author bio */}
        {article.author && (
          <div className="bg-gray-50 border border-gray-200 p-6 mb-10">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">About the Author</h3>
            <div className="flex gap-4">
              {article.author.avatarUrl ? (
                <img src={article.author.avatarUrl} alt={article.author.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#052962] flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {article.author.name?.[0]}
                </div>
              )}
              <div>
                <Link to={`/author/${article.author.username}`} className="font-serif font-bold text-[#052962] hover:underline">
                  {article.author.name}
                </Link>
                {article.author.bio && <p className="text-sm text-gray-600 mt-1">{article.author.bio}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#052962] mb-6 pb-2 border-b-2 border-[#052962]">
            Comments {article.commentsCount ? `(${article.commentsCount})` : ''}
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts on this article..."
                rows={4}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] resize-none rounded"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!comment.trim() || commenting}
                  className="bg-[#052962] text-white px-6 py-2 text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 flex items-center gap-2 rounded"
                >
                  {commenting && <Loader2 size={14} className="animate-spin" />}
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8 text-center">
              <p className="text-sm text-gray-600 mb-2">Join the conversation</p>
              <Link to="/signin" className="text-sm font-semibold text-[#052962] hover:underline">Sign in to comment →</Link>
            </div>
          )}

          <div className="space-y-6">
            {(article.comments || []).length === 0 ? (
              <p className="text-gray-400 text-sm italic text-center py-8">No comments yet. Be the first to share your thoughts.</p>
            ) : (
              article.comments!.map(c => (
                <div key={c.id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#052962] flex items-center justify-center text-white text-xs font-bold">
                      {c.user?.fullName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#052962]">{c.user?.fullName}</p>
                      <p className="text-xs text-gray-400">{c.timeAgo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed ml-11">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

