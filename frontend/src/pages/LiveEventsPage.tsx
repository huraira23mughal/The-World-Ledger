import React from 'react';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function LiveEventsPage() {
  const events = [
    { title: 'The World in 2027: Annual Geopolitical Summit', date: 'Thursday, 18 December 2026', loc: 'Royal Festival Hall, London & Live Global Stream', guests: 'Nobel laureates, central bankers, and Chief Foreign Correspondents' },
    { title: 'An Evening with the Investigative Team', date: 'Tuesday, 26 January 2027', loc: 'The Times Center, New York & Virtual', guests: 'Lead reporters behind our international climate investigations' },
    { title: 'The Ledger Book Festival: Fiction in an Age of AI', date: 'Saturday, 14 February 2027', loc: 'King\'s Place, London', guests: 'Booker Prize winners, literary critics, and essayists' },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#7d0068] pb-4 mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#7d0068]">The World Ledger Live</h1>
        <p className="text-gray-500 text-sm mt-1">Debates, festival discussions, and in-depth conversations with our writers</p>
      </div>

      <div className="space-y-6 mb-12">
        {events.map(ev => (
          <div key={ev.title} className="p-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#7d0068] transition-colors">
            <div className="flex-1">
              <span className="text-xs font-bold text-[#7d0068] flex items-center gap-1 mb-1">
                <Calendar size={14} /> {ev.date}
              </span>
              <h3 className="font-serif font-bold text-2xl text-gray-900 mb-1">{ev.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <MapPin size={12} /> {ev.loc}
              </p>
              <p className="text-xs text-gray-600">Featuring: {ev.guests}</p>
            </div>
            <button
              onClick={() => alert('Tickets reservation: Subscriber priority queue active.')}
              className="bg-[#7d0068] text-white px-6 py-2.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              <Ticket size={14} /> Reserve Tickets
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

