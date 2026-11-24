import React from 'react';
import { Smartphone, Tablet, Apple, Play, Check } from 'lucide-react';

export default function AppsPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#052962] mb-3">
          The World Ledger on iOS & Android
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Download our award-winning app for live breaking news notifications, offline reading, audio editions, and digital crossword puzzles.
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => alert('Redirecting to Apple App Store...')}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            <Apple size={20} />
            <div className="text-left">
              <span className="block text-[9px] opacity-70">Download on the</span>
              <span className="text-sm font-bold leading-none">App Store</span>
            </div>
          </button>
          <button
            onClick={() => alert('Redirecting to Google Play Store...')}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            <Play size={20} className="fill-white" />
            <div className="text-left">
              <span className="block text-[9px] opacity-70">GET IT ON</span>
              <span className="text-sm font-bold leading-none">Google Play</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { title: 'Offline Reading', desc: 'Automatically download morning editions so you can read uninterrupted on commutes or flights.' },
          { title: 'Daily Crosswords', desc: 'Solve our famous quick and cryptic crosswords right inside the app, with offline progress sync.' },
          { title: 'Audio Dispatches', desc: 'Listen to articles narrated by professional voice artists and correspondents.' },
        ].map((f, i) => (
          <div key={i} className="bg-white border rounded p-6 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#052962] flex items-center justify-center mb-3">
              <Check size={16} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#052962] mb-1">{f.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

