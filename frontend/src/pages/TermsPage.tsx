import React from 'react';

export default function TermsPage() {
  return (
    <main className="bg-[#fcfbf8] py-14 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-300 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#052962]">
            Contributor & Reader Agreement
          </span>
          <h1
            className="mt-1 font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Terms of Service & Editorial Guidelines
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Last updated: November 2026 · Governing all published reporting, comments, and memberships.
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-800 leading-relaxed">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              1. Independent Publishing Standards
            </h2>
            <p>
              By accessing The World Ledger, readers and contributors agree to adhere to strict journalistic ethics.
              All submissions undergo factual verification and editorial vetting before publication. Plagiarism, defamation,
              and unsubstantiated accusations are grounds for immediate rejection and contributor de-registration.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              2. Intellectual Property & Bylines
            </h2>
            <p>
              Authors retain moral authorship of their investigative writing while granting The World Ledger an irrevocable,
              worldwide license to publish, distribute, and syndicate the text across digital channels and archives.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              3. Comments and Reader Conduct
            </h2>
            <p>
              Community discussions must remain civil and evidence-based. Comments promoting hate speech, harassment,
              or commercial spam will be removed by moderation desks without warning.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
