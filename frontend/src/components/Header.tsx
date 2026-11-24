import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, Bookmark, LogOut, PenSquare, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categoriesApi } from '../api/client';
import type { Category } from '../types';

export const NAV_SECTIONS = [
  {
    label: 'News',
    slug: 'news',
    defaultPath: '/category/world',
    subs: ['world', 'us-politics', 'uk-news', 'climate-crisis', 'middle-east', 'ukraine', 'environment', 'science', 'global-development']
  },
  {
    label: 'Opinion',
    slug: 'opinion',
    defaultPath: '/category/the-guardian-view',
    subs: ['the-guardian-view', 'columnists', 'cartoons', 'letters']
  },
  {
    label: 'Sport',
    slug: 'sport',
    defaultPath: '/category/football',
    subs: ['football', 'cricket', 'rugby-union', 'tennis', 'formula-1']
  },
  {
    label: 'Culture',
    slug: 'culture',
    defaultPath: '/category/books',
    subs: ['books', 'music', 'film', 'art-and-design', 'stage']
  },
  {
    label: 'Lifestyle',
    slug: 'lifestyle',
    defaultPath: '/category/fashion',
    subs: ['fashion', 'food', 'travel', 'health']
  },
  {
    label: 'More',
    slug: 'more',
    defaultPath: '/category/business',
    subs: ['business', 'technology', 'obituaries']
  },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const getCategoryBySlug = (slug: string) =>
    categories.find(c => c.slug === slug);

  // Determine which section is currently active based on URL
  const currentPath = location.pathname;
  const currentSection = NAV_SECTIONS.find(sec => {
    if (sec.defaultPath === currentPath) return true;
    if (currentPath.startsWith(`/section/${sec.slug}`)) return true;
    return sec.subs.some(sub => currentPath === `/category/${sub}`);
  }) || (currentPath === '/' ? NAV_SECTIONS[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header ref={headerRef} className="bg-[#052962] text-white sticky top-0 z-50 shadow-md">
      {/* Top utility bar */}
      <div className="border-b border-blue-800">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-10">
          <div className="flex items-center gap-4 text-xs text-blue-200">
            <Link to="/support" className="hover:text-white transition-colors">Support Us</Link>
            <Link to="/subscriptions" className="hover:text-white transition-colors">Subscribe</Link>
            <Link to="/newsletters" className="hover:text-white transition-colors">Newsletters</Link>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#ffe500] flex items-center justify-center text-[#052962] font-bold text-xs">
                      {user?.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white text-gray-900 rounded shadow-xl border z-50 py-1">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#052962] text-white">{user?.role}</span>
                    </div>
                    {user?.role === 'Admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    )}
                    {(user?.role === 'Author' || user?.role === 'Admin') && (
                      <Link to="/write" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <PenSquare size={14} /> Write Article
                      </Link>
                    )}
                    <Link to="/bookmarks" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <Bookmark size={14} /> Saved Articles
                    </Link>
                    {user?.username && (
                      <Link to={`/author/${user.username}`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <User size={14} /> My Profile
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="text-xs hover:text-blue-200 transition-colors">Sign in</Link>
                <Link to="/signup" className="text-xs bg-[#ffe500] text-[#052962] px-3 py-1 rounded font-semibold hover:bg-yellow-300 transition-colors">Subscribe</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Broadsheet Masthead */}
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">The World Ledger</span>
          <span className="text-blue-300 text-[10px] tracking-widest uppercase">International Edition</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-blue-800 rounded transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-blue-800 rounded transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
          <form onSubmit={handleSearch} className="max-w-screen-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search The World Ledger..."
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962]"
              autoFocus
            />
            <button type="submit" className="bg-[#052962] text-white px-4 py-2 rounded text-sm hover:bg-blue-900 transition-colors">
              Search
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-700 px-2">
              <X size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <nav className="hidden md:block border-t border-blue-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="flex">
            {/* News Corner special link */}
            <li>
              <Link
                to="/news-corner"
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold tracking-tight transition-colors ${
                  currentPath === '/news-corner' ? 'bg-[#001f4d] text-[#ffe500]' : 'hover:bg-blue-800 text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                News Corner
              </Link>
            </li>
            {NAV_SECTIONS.map(section => {
              const slugsInSection = section.subs;
              const catNames = slugsInSection
                .map(s => getCategoryBySlug(s))
                .filter(Boolean) as Category[];

              const isActive = currentSection?.slug === section.slug;

              return (
                <li key={section.slug} className="relative group">
                  <Link
                    to={section.defaultPath}
                    className={`flex items-center gap-1 px-4 py-3 text-sm font-bold tracking-tight transition-colors ${
                      isActive ? 'bg-[#001f4d] text-[#ffe500]' : 'hover:bg-blue-800 text-white'
                    }`}
                    onMouseEnter={() => setOpenMenu(section.slug)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    {section.label}
                    {catNames.length > 0 && <ChevronDown size={12} className="opacity-70" />}
                  </Link>

                  {/* Mega dropdown menu on hover */}
                  {catNames.length > 0 && openMenu === section.slug && (
                    <div
                      className="absolute left-0 top-full bg-white text-gray-900 shadow-2xl border-t-2 border-[#052962] min-w-[220px] z-50 py-2"
                      onMouseEnter={() => setOpenMenu(section.slug)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      {catNames.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#052962] transition-colors"
                          style={{ borderLeft: `3px solid ${cat.pillarColor}` }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Guardian Secondary Sub-Navigation Bar (Shows desks of current section) */}
      {currentSection && (
        <div className="hidden md:block bg-[#001f4d] border-t border-blue-900/60 text-xs">
          <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2">
            {currentSection.subs.map(subSlug => {
              const cat = getCategoryBySlug(subSlug);
              if (!cat) return null;
              const isSubActive = currentPath === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`px-3 py-1 font-medium transition-colors whitespace-nowrap rounded ${
                    isSubActive
                      ? 'bg-[#ffe500] text-[#052962] font-bold shadow-sm'
                      : 'text-blue-100 hover:text-white hover:bg-blue-900/60'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#052962] border-t border-blue-800 pb-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.slug}>
              <Link
                to={section.defaultPath}
                className="block px-4 py-3 text-sm font-bold border-b border-blue-800 hover:bg-blue-800 text-[#ffe500]"
              >
                {section.label}
              </Link>
              <div className="bg-[#001f4d] py-1">
                {section.subs.map(s => {
                  const cat = getCategoryBySlug(s);
                  if (!cat) return null;
                  return (
                    <Link
                      key={s}
                      to={`/category/${cat.slug}`}
                      className="block pl-8 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-blue-800"
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
