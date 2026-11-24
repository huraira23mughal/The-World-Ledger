import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    role: params.get('role') === 'author' ? 'Author' : 'Reader',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await signup(form);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
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
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-1">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">Join The World Ledger community.</p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {['Reader', 'Author'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role }))}
                  className={`py-2 text-sm font-semibold border-2 transition-all rounded ${
                    form.role === role
                      ? 'border-[#052962] bg-[#052962] text-white'
                      : 'border-gray-300 text-gray-600 hover:border-[#052962]'
                  }`}
                >
                  {role === 'Author' ? '✍️ ' : '📰 '}{role}
                </button>
              ))}
            </div>
            {form.role === 'Author' && (
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-4">
                As an Author, you can write and publish articles after account verification.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or phone number</label>
                <input
                  type="text"
                  value={form.emailOrPhone}
                  onChange={e => setForm(f => ({ ...f, emailOrPhone: e.target.value }))}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  placeholder="email@example.com or +12025550000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded pr-10"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                Create account
              </button>
            </form>

            <p className="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
              By registering, you agree to our{' '}
              <a href="#" className="underline">terms and conditions</a> and{' '}
              <a href="#" className="underline">privacy policy</a>.
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <Link to="/signin" className="text-sm text-[#052962] font-semibold hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

