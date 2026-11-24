import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, ShieldCheck, Loader2, CreditCard } from 'lucide-react';
import { paymentsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SupportPage() {
  const { user } = useAuth();
  const [frequency, setFrequency] = useState<'One-Time' | 'Monthly' | 'Annual'>('Monthly');
  const [amount, setAmount] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState('');
  const [tier, setTier] = useState('Supporter');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');

  const tiers = [
    { name: 'Supporter', min: 5, benefits: ['Unrestricted access to investigative dispatches', 'Ad-free reading experience on all devices', 'Exclusive editor newsletters'] },
    { name: 'Partner', min: 25, benefits: ['All Supporter benefits', 'Invitations to live virtual editorial briefings', 'Quarterly print compendium delivered to your door'] },
    { name: 'Patron', min: 50, benefits: ['All Partner benefits', 'Direct correspondence with lead correspondents', 'Special annual recognition in our print masthead'] },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount < 1) {
      setError('Please choose or enter a valid contribution amount.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await paymentsApi.contribute({
        amount: finalAmount,
        currency: 'USD',
        planOrTier: tier,
        frequency,
        paymentMethod: 'credit_card',
        fullName: fullName || 'Anonymous Supporter',
        email: email || 'supporter@theworldledger.com',
        cardNumberLast4: cardNumber.slice(-4) || '4242'
      });
      setReceipt(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      {receipt ? (
        <div className="max-w-xl mx-auto bg-white border border-green-200 rounded-sm p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#052962] mb-2">Thank you for your support</h1>
          <p className="text-gray-600 text-sm mb-6">
            Your generous contribution empowers independent, fearless journalism around the world.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono font-semibold text-gray-800">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Receipt Number:</span>
              <span className="font-mono font-semibold text-gray-800">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Tier & Frequency:</span>
              <span className="font-semibold text-gray-800">{receipt.planOrTier} ({receipt.frequency})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-base text-[#052962]">${receipt.amount.toFixed(2)} {receipt.currency}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/" className="bg-[#052962] text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-blue-900 transition-colors">
              Continue to The World Ledger
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Masthead Banner */}
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Support Open Journalism
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#052962] mt-4 mb-3">
              Invest in Journalism That Matters
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-base">
              The World Ledger has no billionaire owner or shareholders. Our reporting is funded entirely by readers like you.
              Support us so we can continue holding power to account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left 2 Cols: Plan & Payment */}
            <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded shadow-sm">
              {/* Frequency Selector */}
              <div className="flex border border-gray-300 rounded mb-6 overflow-hidden">
                {(['One-Time', 'Monthly', 'Annual'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                      frequency === f ? 'bg-[#052962] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Amount Pills */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Choose Contribution Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 15, 30, 50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setAmount(amt); setCustomAmount(''); }}
                      className={`py-3 text-lg font-serif font-bold border-2 rounded transition-all ${
                        amount === amt && !customAmount
                          ? 'border-[#052962] bg-blue-50 text-[#052962]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    min="1"
                    placeholder="Or enter custom amount in USD"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setAmount(0); }}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  />
                </div>
              </div>

              {/* Tier Selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Select Supporter Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {tiers.map(t => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setTier(t.name)}
                      className={`p-3 text-left border rounded transition-all ${
                        tier === t.name ? 'border-[#052962] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-serif font-bold text-sm text-[#052962]">{t.name}</p>
                      <p className="text-[11px] text-gray-500 mt-1">From ${t.min}/mo</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-1">
                  <CreditCard size={14} /> Secure Payment Details
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#052962]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded font-mono focus:ring-1 focus:ring-[#052962]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
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
                    <label className="block text-xs text-gray-600 mb-1">Security Code (CVC)</label>
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
                  className="w-full bg-[#052962] text-white py-3 font-semibold text-sm rounded hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Contribute ${customAmount || amount} {frequency}
                </button>
              </form>
            </div>

            {/* Right Col: Benefits */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded h-fit">
              <div className="flex items-center gap-2 text-[#052962] font-serif font-bold text-lg mb-3">
                <Heart size={20} className="fill-red-500 text-red-500" />
                <span>Your Impact</span>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                By supporting The World Ledger, you protect editorial independence and keep investigative journalism freely accessible to everyone.
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Member Privileges</h4>
              <ul className="space-y-2 mb-6">
                {(tiers.find(t => t.name === tier)?.benefits || tiers[0].benefits).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <Check size={14} className="text-green-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-4 flex items-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck size={16} className="text-green-600" />
                <span>256-bit encrypted checkout. Cancel anytime.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

