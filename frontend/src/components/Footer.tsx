import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const sections = [
    {
      title: 'News',
      links: [
        { label: 'World', to: '/category/world' },
        { label: 'US Politics', to: '/category/us-politics' },
        { label: 'UK News', to: '/category/uk-news' },
        { label: 'Climate Crisis', to: '/category/climate-crisis' },
        { label: 'Middle East', to: '/category/middle-east' },
        { label: 'Science', to: '/category/science' },
        { label: 'Environment', to: '/category/environment' },
      ]
    },
    {
      title: 'Culture & Opinion',
      links: [
        { label: 'Books', to: '/category/books' },
        { label: 'Music', to: '/category/music' },
        { label: 'Film', to: '/category/film' },
        { label: 'Art & Design', to: '/category/art-and-design' },
        { label: 'Columnists', to: '/category/columnists' },
        { label: 'The Ledger View', to: '/category/the-guardian-view' },
        { label: 'Letters', to: '/category/letters' },
      ]
    },
    {
      title: 'Sport & Lifestyle',
      links: [
        { label: 'Football', to: '/category/football' },
        { label: 'Cricket', to: '/category/cricket' },
        { label: 'Formula 1', to: '/category/formula-1' },
        { label: 'Fashion', to: '/category/fashion' },
        { label: 'Food & Recipes', to: '/category/food' },
        { label: 'Travel', to: '/category/travel' },
        { label: 'Health & Fitness', to: '/category/health' },
      ]
    },
    {
      title: 'The World Ledger',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Support Us', to: '/support' },
        { label: 'Print Subscriptions', to: '/subscriptions' },
        { label: 'Digital Archive', to: '/archive' },
        { label: 'Newsletters', to: '/newsletters' },
        { label: 'Live Events', to: '/events' },
        { label: 'Licensing', to: '/licensing' },
      ]
    },
    {
      title: 'Tools',
      links: [
        { label: 'Search', to: '/search' },
        { label: 'Today\'s Paper', to: '/todays-paper' },
        { label: 'Video & Podcasts', to: '/audio-video' },
        { label: 'Crosswords', to: '/crosswords' },
        { label: 'Mobile App', to: '/apps' },
        { label: 'Submit a Tip', to: '/submit-tips' },
        { label: 'Holidays', to: '/holidays' },
      ]
    },
  ];

  return (
    <footer className="bg-[#052962] text-white mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* Logo */}
        <div className="mb-8 pb-6 border-b border-blue-800">
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-2xl font-bold">The World Ledger</h2>
            <p className="text-blue-300 text-xs tracking-widest uppercase">International Edition</p>
          </Link>
        </div>

        {/* Directory grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-blue-100 hover:text-white hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-blue-300 space-y-1">
            <p>© {new Date().getFullYear()} The World Ledger Limited. All rights reserved.</p>
            <p>An independent international broadsheet committed to open journalism.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-blue-300">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/submit-tips" className="hover:text-white">Contact</Link>
            <Link to="/licensing" className="hover:text-white">Licensing</Link>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

