import React, { useState } from 'react';
import { Archive, Search, Calendar, BookOpen } from 'lucide-react';

export default function ArchivePage() {
  const [decade, setDecade] = useState('2020s');

  const decades = ['2020s', '2010s', '2000s', '1990s', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s', '1910s', '1900s', '1800s'];

  const milestones = [
    { year: '1921', event: 'The Centenary Address on the moral responsibilities of the press.' },
    { year: '1945', event: 'First-hand dispatches from the signing of the United Nations Charter in San Francisco.' },
    { year: '1969', event: 'Special moon landing commemorative broadsheet issue.' },
    { year: '1989', event: 'Continuous live telex reporting on the fall of the Berlin Wall.' },
    { year: '2013', event: 'Investigative global intelligence surveillance disclosures.' },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#052962] pb-4 mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#052962]">The Digital Archive</h1>
        <p className="text-gray-500 text-sm mt-1">Over 200 years of global reporting, digitized from original broadsheets</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded p-6 mb-10">
        <h2 className="font-serif font-bold text-xl text-[#052962] mb-3">Browse by Historical Era</h2>
        <div className="flex flex-wrap gap-2">
          {decades.map(d => (
            <button
              key={d}
              onClick={() => setDecade(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                decade === d ? 'bg-[#052962] text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-[#052962] mb-6">Historic Milestones in the Ledger</h2>
        <div className="space-y-4">
          {milestones.map(m => (
            <div key={m.year} className="flex gap-4 p-4 border rounded bg-white shadow-sm hover:border-[#052962] transition-colors">
              <span className="font-serif text-2xl font-bold text-[#052962] w-16 shrink-0">{m.year}</span>
              <div>
                <p className="text-sm text-gray-800 font-medium">{m.event}</p>
                <span className="text-xs text-blue-800 hover:underline cursor-pointer mt-1 inline-block">
                  View archived scans →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

