import React from 'react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <main className="bg-[#fbf9f4] py-16 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <span className="rounded-full bg-[#052962]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#052962]">
            Transparent Contributor & Reader Plans
          </span>
          <h1
            className="mt-3 font-serif text-3xl font-extrabold text-[#052962] sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Publishing Plans & Subscriptions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-gray-600 leading-relaxed">
            At The World Ledger, every published article is verified by our editorial board.
            Choose between per-article publishing passes or an all-inclusive monthly author membership.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1: Pay Per Article */}
          <div className="rounded-lg border border-gray-300 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div>
              <span className="rounded bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-900">
                Single Submission
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900">
                Pay Per Article
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Ideal for guest columnists, freelance investigators, and single exposés.
              </p>

              <div className="my-6">
                <span className="font-serif text-4xl font-extrabold text-[#052962]">$25</span>
                <span className="text-xs text-gray-500"> / article submission</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>1 Article submitted for editorial review</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Fact-checking & copy-editing review</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Guaranteed review decision within 24h</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Permanent live hosting once approved</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Full Author Bio and link integration</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/checkout?plan=per-article"
                className="block w-full rounded bg-[#052962] py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#003b8e]"
              >
                Select Per-Article Pass
              </Link>
            </div>
          </div>

          {/* Card 2: Monthly Author Membership */}
          <div className="relative rounded-lg border-2 border-[#052962] bg-white p-7 shadow-md flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#052962] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#ffe500]">
              Recommended for Journalists
            </span>

            <div>
              <span className="rounded bg-[#052962]/10 px-2.5 py-1 text-[11px] font-bold text-[#052962]">
                Author Pro Pass
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900">
                Monthly Contributor
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                For active journalists and columnists publishing multiple stories each month.
              </p>

              <div className="my-6">
                <span className="font-serif text-4xl font-extrabold text-[#052962]">$49</span>
                <span className="text-xs text-gray-500"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span><strong>Unlimited</strong> submissions per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Priority 6-hour editorial turnaround</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Featured homepage placement privileges</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Verified Contributor badge on author profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Live reader analytics & readership breakdown</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/checkout?plan=author-monthly"
                className="block w-full rounded bg-[#ffe500] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#052962] transition hover:bg-[#ffcc00]"
              >
                Start Author Membership
              </Link>
            </div>
          </div>

          {/* Card 3: Reader All-Access Support */}
          <div className="rounded-lg border border-gray-300 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div>
              <span className="rounded bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-900">
                Subscriber
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900">
                Reader Supporter
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Support independent international journalism and enjoy ad-free reading.
              </p>

              <div className="my-6">
                <span className="font-serif text-4xl font-extrabold text-[#052962]">$5</span>
                <span className="text-xs text-gray-500"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Unlimited reading of all paywalled features</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>100% ad-free desktop & mobile reading</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Exclusive Saturday morning editor briefings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Bookmark & organize reading lists</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22874d] font-bold">✓</span>
                  <span>Subscriber comments badge</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/checkout?plan=reader"
                className="block w-full rounded border border-[#052962] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#052962] transition hover:bg-gray-100"
              >
                Support Independent Press
              </Link>
            </div>
          </div>
        </div>

        {/* Institutional / Enterprise Banner */}
        <div className="mt-14 rounded-lg bg-[#052962] p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold">
              Newsroom Syndication & Academic Access
            </h3>
            <p className="mt-1 max-w-xl text-xs text-blue-200">
              Custom site licenses for news organizations, university libraries, and think tanks.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/contact"
              className="inline-block rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#052962] hover:bg-gray-100"
            >
              Contact Enterprise Desk
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
