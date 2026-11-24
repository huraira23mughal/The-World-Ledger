import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-[#fbf9f4] py-14 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 border-b border-gray-300 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#052962]">
            Contact Desk
          </span>
          <h1
            className="mt-1 font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Get in Touch with The World Ledger
          </h1>
          <p className="mt-2 text-xs text-gray-600">
            Inquiries, press credentials, editorial feedback, and confidential whistleblower drops.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
          {/* Contact Form */}
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Send an Editorial Message
            </h2>

            {submitted ? (
              <div className="rounded bg-emerald-50 p-5 border border-emerald-200 text-center">
                <span className="text-2xl text-[#22874d]">✓</span>
                <p className="mt-2 text-xs font-bold text-emerald-800">
                  Your message has been securely delivered to the newsroom desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Department</label>
                  <select className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]">
                    <option>Editorial Board & Corrections</option>
                    <option>Investigative Whistleblower Drop</option>
                    <option>Contributor & Author Submissions</option>
                    <option>Advertising & Commercial Sponsorships</option>
                    <option>Technical & Subscription Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-1">Message</label>
                  <textarea
                    rows={5}
                    placeholder="State your inquiry or detailed report..."
                    className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-[#052962] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#003b8e] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Message
                </button>
              </form>
            )}
          </div>

          {/* Bureau Information */}
          <div className="space-y-6 text-xs">
            <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#052962]" /> London Newsroom
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kings Place, 90 York Way<br />
                London N1 9GU, United Kingdom
              </p>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#052962]" /> Direct Communications
              </h3>
              <p className="text-gray-600 leading-relaxed space-y-1">
                <span>General: info@theworldledger.com</span><br />
                <span>Editorial: editor@theworldledger.com</span><br />
                <span>Press Desk: press@theworldledger.com</span>
              </p>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#052962]" /> Switchboard
              </h3>
              <p className="text-gray-600 leading-relaxed">
                International: +44 (0) 20 3353 2000<br />
                US Bureau: +1 (212) 556-1234
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
