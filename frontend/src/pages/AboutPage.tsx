import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Shield, Users2, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="border-b-4 border-[#052962] pb-4 mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#052962]">About The World Ledger</h1>
          <p className="text-gray-500 text-sm mt-2">Open journalism with international perspective and moral independence</p>
        </div>

        <div className="prose prose-lg font-serif text-gray-700 leading-relaxed space-y-6">
          <p className="text-xl text-[#052962] font-semibold leading-relaxed">
            The World Ledger was founded on a simple conviction: that an informed public is the cornerstone of democracy, human freedom, and global justice.
          </p>
          <p>
            Unlike many corporate news conglomerates, The World Ledger has no billionaire owner or shareholders demanding immediate profits.
            Our editorial independence is shielded through reader subscriptions and philanthropic supporters.
          </p>

          <div className="grid grid-cols-2 gap-4 not-prose my-8">
            <div className="p-4 border rounded bg-gray-50">
              <Globe2 className="text-[#052962] mb-2" size={24} />
              <h4 className="font-bold text-sm text-[#052962]">130+ Correspondents</h4>
              <p className="text-xs text-gray-500 mt-1">Reporting on the ground across 6 continents without regional bias.</p>
            </div>
            <div className="p-4 border rounded bg-gray-50">
              <Shield className="text-[#052962] mb-2" size={24} />
              <h4 className="font-bold text-sm text-[#052962]">100% Independent</h4>
              <p className="text-xs text-gray-500 mt-1">Free from editorial censorship or political donor directives.</p>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#052962]">Our Editorial Charter</h2>
          <p>
            Our journalists follow strict verification procedures. We prioritize primary source evidence, rigorous fact-checking, and open scrutiny.
            When mistakes happen, we acknowledge them transparently in our public Corrections ledger.
          </p>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded text-center">
          <h3 className="font-serif font-bold text-lg text-[#052962] mb-2">Join our international readership</h3>
          <p className="text-sm text-gray-600 mb-4">Support our mission by subscribing or writing for us.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/support" className="bg-[#052962] text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-900">
              Support Us
            </Link>
            <Link to="/signup?role=author" className="border-2 border-[#052962] text-[#052962] px-6 py-2 rounded text-sm font-semibold hover:bg-white">
              Write for Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

