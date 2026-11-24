import React from 'react';
import { Copyright, BookOpen, Share2, FileCheck } from 'lucide-react';

export default function LicensingPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="border-b-4 border-[#052962] pb-4 mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#052962]">Syndication & Content Licensing</h1>
          <p className="text-gray-500 text-sm mt-1">Republish World Ledger investigations, photographs, infographics, and essays</p>
        </div>

        <div className="prose font-serif text-gray-700 leading-relaxed space-y-4 mb-10">
          <p className="text-lg text-[#052962] font-semibold">
            Our reporting is syndicated in over 60 languages by leading newspapers, academic institutions, and broadcast networks globally.
          </p>
          <p className="text-sm">
            Whether you require text republication rights, photographic licenses, or bespoke investigative packages, our Rights & Permissions desk coordinates international syndication seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 border rounded bg-white shadow-sm">
            <BookOpen size={24} className="text-[#052962] mb-2" />
            <h3 className="font-serif font-bold text-base text-[#052962]">Academic & Educational</h3>
            <p className="text-xs text-gray-600 mt-1">Classroom coursepacks, university research licenses, and non-profit publications.</p>
          </div>
          <div className="p-5 border rounded bg-white shadow-sm">
            <Share2 size={24} className="text-[#052962] mb-2" />
            <h3 className="font-serif font-bold text-base text-[#052962]">Commercial Media Syndication</h3>
            <p className="text-xs text-gray-600 mt-1">Wire service reprints, broadcast translation rights, and digital licensing.</p>
          </div>
        </div>

        <div className="bg-gray-50 border p-6 rounded">
          <h4 className="font-serif font-bold text-[#052962] mb-2">Request Permission</h4>
          <p className="text-xs text-gray-600 mb-4">Direct all inquiries to licensing@theworldledger.com or telephone our London Syndication Desk at +44 (0)20 7131 7000.</p>
          <button
            onClick={() => alert('Licensing request form initiated. An editor will contact you within 24 hours.')}
            className="bg-[#052962] text-white px-6 py-2 rounded text-xs font-semibold hover:bg-blue-900"
          >
            Submit Syndication Inquiry
          </button>
        </div>
      </div>
    </main>
  );
}

