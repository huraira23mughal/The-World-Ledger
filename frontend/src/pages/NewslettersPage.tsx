import React, { useState } from 'react';
import { Mail, Check, CheckCircle2 } from 'lucide-react';

export default function NewslettersPage() {
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const newsletters = [
    { id: 'morning-brief', name: 'First Edition: Morning Briefing', freq: 'Daily, 6am GMT', desc: 'An essential curated briefing on the stories that define the world each morning, by Archie Bland.' },
    { id: 'down-to-earth', name: 'Down to Earth', freq: 'Weekly on Thursdays', desc: 'The most important environmental, climate, and planetary news explained clearly by Damian Carrington.' },
    { id: 'today-in-politics', name: 'Politics Ledger', freq: 'Weekdays, 4pm GMT', desc: 'Behind the scenes at Westminster, Capitol Hill, and the corridors of geopolitical power.' },
    { id: 'saturday-read', name: 'The Saturday Essay & Culture', freq: 'Weekly on Saturdays', desc: 'Long-read investigations, literary criticism, and visual arts essays for your weekend.' },
  ];

  const toggleSub = (id: string) => {
    setSubscribed(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubscribeAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribed.length === 0) return;
    setSuccess(true);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="border-b-4 border-[#052962] pb-4 mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#052962]">Editorial Newsletters</h1>
          <p className="text-gray-500 text-sm mt-1">Direct from our lead correspondents straight to your inbox</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded p-8 text-center">
            <CheckCircle2 size={40} className="text-green-600 mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-[#052962] mb-2">You're Subscribed!</h2>
            <p className="text-sm text-gray-600">
              We have dispatched a confirmation link to <strong>{email}</strong>. Check your inbox to confirm.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribeAll} className="space-y-6">
            <div className="space-y-4">
              {newsletters.map(n => {
                const isSelected = subscribed.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => toggleSub(n.id)}
                    className={`p-5 border-2 rounded cursor-pointer transition-all ${
                      isSelected ? 'border-[#052962] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif font-bold text-lg text-[#052962]">{n.name}</h3>
                          <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{n.freq}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{n.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 ${
                        isSelected ? 'bg-[#052962] border-[#052962] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Enter your email address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                />
                <button
                  type="submit"
                  disabled={subscribed.length === 0}
                  className="bg-[#052962] text-white px-6 py-2 text-sm font-semibold rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  Subscribe to {subscribed.length} {subscribed.length === 1 ? 'Newsletter' : 'Newsletters'}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Free. No spam. One-click unsubscribe at any time.</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

