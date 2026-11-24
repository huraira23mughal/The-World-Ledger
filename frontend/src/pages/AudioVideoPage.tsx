import React from 'react';
import { Headphones, Video, Mic, Radio, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AudioVideoPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#052962] pb-4 mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#052962]">Podcasts & Video Documentaries</h1>
        <p className="text-gray-500 text-sm mt-1">Audio dispatches, daily briefings, and investigative documentaries</p>
      </div>

      {/* Podcast Series Grid */}
      <div className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-[#052962] mb-6 flex items-center gap-2">
          <Headphones size={22} /> Flagship Podcasts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Today in Focus', host: 'Nosheen Iqbal & Michael Safi', desc: 'The story behind the headlines with deep investigative reporting.', ep: 'Episode 1,482: The Battle for the Arctic Shelf' },
            { title: 'Politics Weekly America', host: 'Jonathan Freedland', desc: 'Dissecting White House maneuvers, Capitol Hill policy, and electoral shifts.', ep: 'Episode 294: Supreme Court Decisions on Climate Regulation' },
            { title: 'Science Weekly', host: 'Ian Sample', desc: 'Unpacking the discoveries transforming our understanding of the universe.', ep: 'Episode 842: Quantum Computing Breakthroughs' },
          ].map(p => (
            <div key={p.title} className="bg-white border border-gray-200 rounded p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#052962] text-[#ffe500] rounded flex items-center justify-center mb-4">
                  <Mic size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#052962]">{p.title}</h3>
                <p className="text-xs text-gray-500 mb-2">Hosted by {p.host}</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.desc}</p>
              </div>
              <div className="border-t pt-3">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1">LATEST EPISODE</span>
                <p className="text-xs font-medium text-gray-800 line-clamp-1">{p.ep}</p>
                <button
                  onClick={() => alert('Streaming player connecting to audio feed...')}
                  className="mt-3 w-full bg-[#052962] text-white py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-900 transition-colors"
                >
                  <Play size={12} className="fill-white" /> Listen Now (24 min)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Hub Notice - Following rule: Videos appear after user uploads */}
      <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center max-w-2xl mx-auto">
        <Video size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="font-serif font-bold text-xl text-[#052962] mb-2">Investigative Video Desk</h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Our video desk broadcasts original field reports, short documentaries, and eyewitness analysis.
          Video dispatches appear dynamically as our accredited contributors upload and verify footage.
        </p>
        <Link
          to="/signup?role=author"
          className="inline-block bg-[#052962] text-white px-6 py-2 rounded text-xs font-semibold hover:bg-blue-900"
        >
          Submit Video Documentary
        </Link>
      </div>
    </main>
  );
}

