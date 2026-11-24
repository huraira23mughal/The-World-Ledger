import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="bg-[#fcfbf8] py-14 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-300 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#052962]">
            Legal & Data Protection
          </span>
          <h1
            className="mt-1 font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Privacy Policy & Data Security
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Last updated: November 2026 · Compliant with GDPR, CCPA, and international privacy standards.
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-800 leading-relaxed">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              1. Our Privacy Commitment
            </h2>
            <p>
              The World Ledger respects your fundamental right to privacy. We operate on a strict data-minimization principle:
              we collect only what is strictly necessary to authenticate users, facilitate publishing passes, and deliver editorial content.
              We do not sell personal data or monetize private reading habits to third-party ad brokers.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              2. Information We Process
            </h2>
            <p>When you create an account, contribute an article, or subscribe:</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Account Data:</strong> Name, verified email address, role credentials (Reader, Author, Admin).</li>
              <li><strong>Contributor Records:</strong> Manuscripts submitted, review feedback, bylines, and author profile details.</li>
              <li><strong>Payment Records:</strong> Payment transaction reference numbers and plan selections processed through PCI-DSS compliant gateways. (We never store raw credit card numbers).</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              3. High-Level Security Architecture
            </h2>
            <p>
              All communications and transactions are protected using TLS 1.3 encryption, Strict-Transport-Security (HSTS),
              Content Security Policies, and role-based access control guards.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-[#052962] mb-2">
              4. Cookies and Local Storage
            </h2>
            <p>
              We only use functional tokens to maintain your active secure session and preferences (such as bookmarked stories).
              No non-essential third-party advertising tracking cookies are embedded in our newspaper layout.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
