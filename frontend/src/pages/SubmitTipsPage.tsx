import React, { useState } from 'react';
import { ShieldCheck, Lock, Send, CheckCircle2 } from 'lucide-react';

export default function SubmitTipsPage() {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="border-b-4 border-[#052962] pb-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-900 bg-blue-100 px-3 py-1 rounded-full w-fit mb-3">
            <Lock size={12} /> Confidential Whistleblower Channel
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#052962]">Send a Tip to Our Journalists</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            The World Ledger investigates stories of public interest, corruption, environmental destruction, and corporate malfeasance.
            We take every measure to protect our sources.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded p-8 text-center">
            <CheckCircle2 size={40} className="text-green-600 mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-[#052962] mb-2">Encrypted Tip Received</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Your confidential dispatch has been routed to our Senior Investigations Desk.
              If you provided contact credentials, an investigative editor may follow up via Signal or PGP.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Story Topic or Entity</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Environmental violations in North Sea"
                className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Confidential Information & Evidence</label>
              <textarea
                required
                rows={6}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe what occurred, who was involved, dates, and where corroborating documents can be verified..."
                className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Secure Contact Handle (Optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="Signal number, ProtonMail, or leave blank to remain 100% anonymous"
                className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
              />
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-[11px] text-gray-500 flex items-start gap-2">
              <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
              <span>We do not record your IP address or browser fingerprints on this confidential whistleblower desk.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#052962] text-white py-3 rounded font-semibold text-sm hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} /> Submit Encrypted Tip
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

