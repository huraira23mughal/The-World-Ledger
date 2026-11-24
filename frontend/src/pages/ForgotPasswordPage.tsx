import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { authApi } from '../api/client';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword({ identifier });
      if (data.success) {
        navigate(`/reset-password?identifier=${encodeURIComponent(identifier)}`);
      } else {
        setError(data.message || 'Unable to send reset code.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error sending password reset request.');
    } finally {
      setLoading(false);
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
              <Mail size={24} />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-1">Reset your password</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email or phone number and we will send you a verification code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email or phone</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  placeholder="email@example.com"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#052962] text-white py-2.5 font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Send Reset Code
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Link to="/signin" className="text-sm text-[#052962] hover:underline">
                Return to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

