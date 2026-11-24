import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const SECTION_DEFAULTS: Record<string, string> = {
  news: '/category/world',
  opinion: '/category/the-guardian-view',
  sport: '/category/football',
  culture: '/category/books',
  lifestyle: '/category/fashion',
  more: '/category/business',
};

export default function SectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const normalized = slug?.toLowerCase() || 'news';
  const target = SECTION_DEFAULTS[normalized] || '/category/world';

  return <Navigate to={target} replace />;
}
