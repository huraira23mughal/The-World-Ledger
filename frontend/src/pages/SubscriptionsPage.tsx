import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Newspaper, Smartphone, PackageCheck, Loader2 } from 'lucide-react';
import { paymentsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'digital' | 'print' | 'bundle'>('bundle');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');

  const plans = {
    digital: {
      name: 'Digital All-Access',
      icon: Smartphone,
      monthly: 12.99,
      annual: 119.99,
      features: ['Full website & mobile app access', 'Ad-free clean reader experience', 'Digital replica edition on tablet', 'Audio editions & exclusive podcasts'],
    },
    print: {
      name: 'Print Weekly Edition',
      icon: Newspaper,
      monthly: 24.99,
      annual: 249.99,
      features: ['Delivered every Saturday morning', 'High-quality broadsheet printing', 'Special cultural & literary supplements', 'World Ledger Book Review included'],
    },
    bundle: {
      name: 'Complete Print + Digital',
      icon: PackageCheck,
      monthly: 32.99,
      annual: 319.99,
      features: ['Everything in Digital All-Access', 'Weekly print broadsheet delivery', 'Exclusive subscriber live events', 'Archive access back to 1821'],
    },
  };

  const currentPlan = plans[selectedPlan];
  const price = billingCycle === 'annual' ? currentPlan.annual : currentPlan.monthly;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await paymentsApi.contribute({
        amount: price,
        currency: 'USD',
        planOrTier: currentPlan.name,
        frequency: billingCycle === 'annual' ? 'Annual' : 'Monthly',
        paymentMethod: 'credit_card',
        fullName: fullName || 'Subscriber',
        email: email || 'subscriber@theworldledger.com',
        cardNumberLast4: cardNumber.slice(-4) || '8888',
      });
      setReceipt(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      {receipt ? (
        <div className="max-w-xl mx-auto bg-white border border-green-200 rounded p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#052962] mb-2">Subscription Activated</h1>
          <p className="text-gray-600 text-sm mb-6">
            Welcome to The World Ledger readership. Your digital access is unlocked immediately.
          </p>
          <div className="bg-gray-50 border p-4 rounded text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Receipt:</span>
              <span className="font-mono font-bold text-gray-800">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Plan:</span>
              <span className="font-semibold text-gray-800">{receipt.planOrTier}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Billing:</span>
              <span className="font-semibold text-gray-800">{receipt.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-base text-[#052962]">${receipt.amount.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/" className="inline-block bg-[#052962] text-white px-8 py-2.5 rounded font-semibold text-sm hover:bg-blue-900 transition-colors">
            Start Reading
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#052962] mb-3">
              Print & Digital Subscriptions
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Experience the world's most trusted reporting in print, online, and on your tablet.
            </p>

            {/* Cycle toggle */}
            <div className="inline-flex items-center gap-3 mt-6 bg-gray-100 p-1 rounded-full">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  billingCycle === 'monthly' ? 'bg-[#052962] text-white' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors flex items-center gap-1 ${
                  billingCycle === 'annual' ? 'bg-[#052962] text-white' : 'text-gray-600'
                }`}
              >
                Annual <span className="bg-[#ffe500] text-[#052962] text-[10px] px-1.5 py-0.2 rounded font-bold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(Object.entries(plans) as [keyof typeof plans, typeof plans['bundle']][]).map(([key, p]) => (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`border-2 rounded p-6 cursor-pointer transition-all bg-white relative ${
                  selectedPlan === key ? 'border-[#052962] ring-2 ring-[#052962]/20' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {key === 'bundle' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffe500] text-[#052962] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <p.icon size={20} className="text-[#052962]" />
                  <h3 className="font-serif font-bold text-lg text-[#052962]">{p.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="font-serif text-3xl font-bold text-[#052962]">
                    ${billingCycle === 'annual' ? p.annual : p.monthly}
                  </span>
                  <span className="text-xs text-gray-500"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-600 mb-4 border-t pt-4">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={14} className="text-green-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Checkout form */}
          <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-4">Complete Your Subscription</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subscriber Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                  />
                </div>
              </div>

              {selectedPlan !== 'digital' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Delivery Address (For Print Edition)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, City, Postal Code, Country"
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded font-mono focus:ring-1 focus:ring-[#052962]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={e => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded font-mono focus:ring-1 focus:ring-[#052962]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#052962] text-white py-3 font-semibold text-sm rounded hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Subscribe to {currentPlan.name} (${price})
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-green-600" />
                Secured by 256-bit SSL encryption. Renews automatically. Cancel anytime.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

