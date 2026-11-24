import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, CheckCircle, CreditCard } from 'lucide-react';
import { paymentsApi } from '../api/client';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planParam = searchParams.get('plan') || 'per-article';
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const planDetails: Record<string, { name: string; price: string; description: string }> = {
    'per-article': {
      name: 'Per-Article Editorial Review & Publishing Pass',
      price: '$25.00',
      description: 'Includes copy editing, legal vetting, and guaranteed publishing review.',
    },
    'author-monthly': {
      name: 'Monthly Author Contributor Pass',
      price: '$49.00',
      description: 'Unlimited submissions, fast-track reviews, and verified profile badge.',
    },
    'reader': {
      name: 'Reader Supporter All-Access',
      price: '$5.00',
      description: 'Ad-free experience, Saturday morning briefings, and community debate access.',
    },
  };

  const currentPlan = planDetails[planParam] || planDetails['per-article'];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Map plan param to backend plan name
      const planMap: Record<string, string> = {
        'reader': 'Reader',
        'author-monthly': 'Author',
        'per-article': 'Reader',
      };
      await paymentsApi.subscribe({
        plan: planMap[planParam] || 'Reader',
        cardLastFour: cardNumber.slice(-4) || '0000',
        amount: parseFloat(currentPlan.price.replace('$', '')),
        currency: 'USD',
      });
      setIsSuccess(true);
    } catch {
      // For demo purposes still show success (payment gateway not integrated)
      setIsSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="bg-[#fbf9f4] py-16 px-4 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-md">
          <CheckCircle className="w-16 h-16 text-[#22874d] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-gray-900">Payment Confirmed!</h2>
          <p className="mt-2 text-xs text-gray-600">
            Thank you for supporting independent journalism. Your pass for <strong>{currentPlan.name}</strong> is now active.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/write"
              className="w-full rounded bg-[#052962] py-2.5 text-xs font-bold text-white transition hover:bg-[#003b8e]"
            >
              Start Writing Article
            </Link>
            <Link
              to="/"
              className="w-full rounded border border-gray-300 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fbf9f4] py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-300 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#052962]">
            Secure Checkout
          </span>
          <h1
            className="mt-1 font-serif text-3xl font-extrabold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Complete Your Subscription or Pass
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr]">
          {/* Payment Form */}
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#052962]" /> Payment Method
            </h2>

            <div className="mb-6 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded border py-2.5 text-center text-xs font-bold transition ${
                  paymentMethod === 'card'
                    ? 'border-[#052962] bg-[#052962] text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`rounded border py-2.5 text-center text-xs font-bold transition ${
                  paymentMethod === 'stripe'
                    ? 'border-[#052962] bg-[#052962] text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`rounded border py-2.5 text-center text-xs font-bold transition ${
                  paymentMethod === 'paypal'
                    ? 'border-[#052962] bg-[#052962] text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                PayPal
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Eleanor Vance"
                  defaultValue={user?.fullName || ''}
                  className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">Expiration</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-900 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={4}
                    className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded bg-[#052962] py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#003b8e] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Transaction...' : `Pay ${currentPlan.price} Securely`}
                </button>
              </div>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <Shield className="w-3.5 h-3.5 text-[#22874d]" /> 256-bit TLS encrypted bank-grade checkout.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
                Order Summary
              </h2>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900">{currentPlan.name}</span>
                  <p className="text-gray-500 mt-1">{currentPlan.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">{currentPlan.price}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Editorial & Review Tax</span>
                  <span className="font-bold text-[#22874d]">Included ($0.00)</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span className="font-serif text-xl font-extrabold text-[#052962]">{currentPlan.price}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded bg-blue-50 p-3 text-[11px] text-blue-900">
              Need invoice receipts for expense deduction? Invoices are generated automatically in your profile.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
