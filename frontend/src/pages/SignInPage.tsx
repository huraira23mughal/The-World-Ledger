import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.emailOrPhone, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else if (result.requiresOtp) {
      navigate(`/verify-otp?identifier=${encodeURIComponent(form.emailOrPhone)}`);
    } else {
      setError(result.message);
    }
  };

  const handleDemo = async (role: 'admin' | 'author' | 'reader') => {
    setDemoLoading(role);
    setError('');
    await demoLogin(role);
    setDemoLoading(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-serif text-3xl font-bold text-[#052962]">The World Ledger</h1>
          </Link>
          <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#052962] mb-1">Sign in or create an account</h2>
            <p className="text-sm text-gray-500 mb-6">One account to access all World Ledger products.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or phone number</label>
                <input
                  type="text"
                  value={form.emailOrPhone}
                  onChange={e => setForm(f => ({ ...f, emailOrPhone: e.target.value }))}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                  placeholder="email@example.com"
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
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                Sign in
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-xs text-[#052962] hover:underline">Forgot password?</Link>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
            </div>

            <Link
              to="/signup"
              className="block w-full border-2 border-[#052962] text-[#052962] py-2.5 font-semibold text-sm text-center hover:bg-blue-50 transition-colors rounded"
            >
              Create account
            </Link>

            {/* Terms */}
            <p className="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
              By proceeding, you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600">terms and conditions</a> and{' '}
              <a href="#" className="underline hover:text-gray-600">privacy policy</a>.
            </p>
          </div>
        </div>

        {/* Demo Logins */}
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">⚡ Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'admin' as const, label: 'Admin', color: 'bg-red-600' },
              { role: 'author' as const, label: 'Author', color: 'bg-[#052962]' },
              { role: 'reader' as const, label: 'Reader', color: 'bg-gray-600' },
            ].map(({ role, label, color }) => (
              <button
                key={role}
                onClick={() => handleDemo(role)}
                disabled={!!demoLoading}
                className={`${color} text-white py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1 rounded`}
              >
                {demoLoading === role ? <Loader2 size={12} className="animate-spin" /> : null}
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-amber-600 mt-2">
            Admin: admin@theworldledger.com / Admin@123456!
          </p>
        </div>
      </div>
    </div>
  );
}

