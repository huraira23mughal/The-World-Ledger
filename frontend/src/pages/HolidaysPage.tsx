import React from 'react';
import { Compass, MapPin, Sun, ShieldCheck } from 'lucide-react';

export default function HolidaysPage() {
  const tours = [
    { title: 'The Silk Road Odyssey: Tashkent to Samarkand', duration: '14 days', style: 'Cultural Expedition', desc: 'Accompanied by World Ledger Central Asia correspondents and architectural historians.' },
    { title: 'Patagonia & Antarctic Convergence', duration: '18 days', style: 'Eco-Voyage', desc: 'Witness marine biodiversity alongside our environmental writers on an expedition vessel.' },
    { title: 'Literary & Architectural Scotland', duration: '8 days', style: 'Heritage Tour', desc: 'Private access to historical libraries, castles, and writing retreats in the Highlands.' },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#008b8b] pb-4 mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#008b8b]">World Ledger Holidays</h1>
        <p className="text-gray-500 text-sm mt-1">Curated, sustainable journeys guided by our international correspondents and experts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tours.map(t => (
          <div key={t.title} className="bg-white border rounded shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008b8b] mb-2">
                <Compass size={14} /> {t.style} · {t.duration}
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">{t.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{t.desc}</p>
            </div>
            <button
              onClick={() => alert('Tour brochure dispatched to registered subscriber email.')}
              className="w-full bg-[#008b8b] text-white py-2 rounded text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Request Itinerary Brochure
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-3">
        <ShieldCheck size={20} className="shrink-0 text-emerald-700" />
        <span>All World Ledger expeditions are 100% carbon-offset and support local conservation charities.</span>
      </div>
    </main>
  );
}

