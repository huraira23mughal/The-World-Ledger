import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';

export default function VerifyOtpPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  const identifier = params.get('identifier') || '';
  const purpose = params.get('purpose') || 'Login';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await verifyOtp(identifier, code, purpose);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResendMessage('');
    try {
      const { data } = await authApi.sendOtp({ identifier, purpose });
      setResendMessage(data.message || 'New OTP sent.');
      setTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-serif text-3xl font-bold text-[#052962]">The World Ledger</h1>
          </Link>
          <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-[#052962] rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound size={24} />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-1">Enter Verification Code</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a 6-digit code to <strong className="text-gray-800">{identifier}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  className="w-full border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  placeholder="000000"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}

              {resendMessage && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{resendMessage}</p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-[#052962] text-white py-2.5 font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Verify & Continue
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || timer > 0}
                className="text-[#052962] font-semibold hover:underline disabled:text-gray-400"
              >
                {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
              </button>
              <Link to="/signin" className="text-gray-500 hover:underline">
                Use password instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

