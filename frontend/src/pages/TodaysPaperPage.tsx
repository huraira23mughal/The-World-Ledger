import React from 'react';
import { Newspaper, Calendar, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TodaysPaperPage() {
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#052962] pb-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <Calendar size={14} /> {todayFormatted} · Issue No. 54,921
        </div>
        <h1 className="font-serif text-4xl font-bold text-[#052962]">Today's Paper</h1>
        <p className="text-gray-500 text-sm mt-1">The complete daily broadsheet newspaper edition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Front page replica preview */}
        <div className="border-2 border-gray-300 p-4 bg-white shadow-md">
          <div className="border-b-2 border-gray-900 pb-2 mb-4 text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#052962]">The World Ledger</h2>
            <p className="text-[10px] tracking-widest uppercase text-gray-500">London · Washington · Paris · Tokyo</p>
          </div>
          <div className="aspect-[3/4] bg-gray-100 border border-gray-200 flex flex-col items-center justify-center p-6 text-center">
            <Newspaper size={48} className="text-gray-400 mb-4" />
            <p className="font-serif font-bold text-gray-800 text-base mb-1">Front Page Broadsheet Edition</p>
            <p className="text-xs text-gray-500 mb-4">{todayFormatted}</p>
            <Link
              to="/subscriptions"
              className="bg-[#052962] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-blue-900 transition-colors"
            >
              Unlock Full Digital Replica
            </Link>
          </div>
        </div>

        {/* Sections in today's print */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#052962] border-b pb-2">Broadsheet Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { section: 'Section 1: Main Broadsheet', pages: '32 pages', items: ['Global Diplomatic Summit', 'Westminster Reform Bill', 'Markets & Exchange Ticker'] },
              { section: 'Section 2: Journal & Opinion', pages: '16 pages', items: ['The World Ledger View', 'Global Columnists Debate', 'Letters to the Editor'] },
              { section: 'Section 3: World Business', pages: '12 pages', items: ['Central Bank Rates Decisions', 'Sovereign Debt Trends', 'Tech Valuation Analysis'] },
              { section: 'Section 4: Arts & Books', pages: '16 pages', items: ['Review of Contemporary Fiction', 'European Philharmonic Review', 'Weekend Gallery Guide'] },
            ].map(sec => (
              <div key={sec.section} className="p-4 border rounded bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif font-bold text-sm text-[#052962]">{sec.section}</h3>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">{sec.pages}</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  {sec.items.map((it, idx) => (
                    <li key={idx} className="truncate">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-6 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 leading-relaxed flex items-center justify-between">
            <div>
              <p className="font-bold text-sm mb-1">Prefer physical newsprint delivered to your door?</p>
              <p className="text-gray-600">Subscribe to our weekly print edition, printed on sustainably forested broadsheet stock.</p>
            </div>
            <Link to="/subscriptions" className="bg-[#052962] text-white px-4 py-2 rounded font-semibold text-xs shrink-0 hover:bg-blue-900 ml-4">
              Print Delivery
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

