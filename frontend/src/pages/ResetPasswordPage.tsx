import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, KeyRound } from 'lucide-react';
import { authApi } from '../api/client';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const identifier = params.get('identifier') || '';

  const [form, setForm] = useState({
    identifier: identifier,
    otpCode: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword(form);
      if (data.success) {
        navigate('/signin');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error resetting password.');
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
              <KeyRound size={24} />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-1">Create new password</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter the 6-digit code sent to your device and your new password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account identifier</label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Reset Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={form.otpCode}
                  onChange={e => setForm(f => ({ ...f, otpCode: e.target.value.replace(/\D/g, '') }))}
                  required
                  placeholder="123456"
                  className="w-full border border-gray-300 px-3 py-2 text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
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
                Reset Password
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

