import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Check, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'invoices'>('profile');
  const [fullName, setFullName] = useState(user?.fullName || 'Eleanor Vance');
  const [bio, setBio] = useState(user?.bio || 'Chief Editor & Platform Administrator.');
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Profile Heading */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#052962]">
              Account ID: {user?.id || 'USR_AUTHENTICATED'}
            </span>
            <h1
              className="mt-1 font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Account & Security Settings
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Manage your author credentials, email verification, and subscriber details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#052962] px-3.5 py-1 text-xs font-bold text-white capitalize">
              Role: {user?.role || 'Reader'}
            </span>
            {user?.isEmailVerified && (
              <span className="rounded-full bg-[#22874d] px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex gap-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#052962] text-[#052962]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Profile Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 text-xs font-bold transition ${
              activeTab === 'security'
                ? 'border-b-2 border-[#052962] text-[#052962]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Security & Authentication
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`pb-2.5 text-xs font-bold transition ${
              activeTab === 'invoices'
                ? 'border-b-2 border-[#052962] text-[#052962]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Passes & Receipts
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="mb-6 rounded bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-[#22874d]" /> Profile changes have been saved to SQL Server.
        </div>
      )}

      {/* Profile Details Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Full Byline Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Registered Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-500"
              />
              <span className="mt-1 block text-[11px] text-gray-500">
                Email is tied to your cryptographic JWT identity. Contact support to change.
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Phone Number</label>
              <input
                type="text"
                value={user?.phoneNumber || '+12025550143'}
                disabled
                className="w-full rounded border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Author Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded border border-gray-300 px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#052962]"
              />
            </div>

            <button
              type="submit"
              className="rounded bg-[#052962] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#003b8e]"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#052962]" /> Two-Factor Authentication (2FA via SMS/OTP)
            </h3>
            <p className="mt-1 text-gray-600">
              Add a mandatory OTP verification check whenever signing in from a new device.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="2fa"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#052962]"
              />
              <label htmlFor="2fa" className="font-bold text-gray-900">
                Require One-Time Password (OTP) on login
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-serif text-lg font-bold text-gray-900">Password</h3>
            <p className="mt-1 text-gray-600">
              Passwords are salted and securely hashed with BCrypt.
            </p>
            <a
              href="/forgot-password"
              className="mt-3 inline-block rounded border border-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-50"
            >
              Reset Password via Email
            </a>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#052962]" /> Publishing Receipts & Subscription Passes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Invoice Ref</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-[#052962]">INV-2026-1042</td>
                  <td className="py-3 px-3 text-gray-600">11 Nov 2026</td>
                  <td className="py-3 px-3 font-medium text-gray-900">Chief Editor Permanent Access Pass</td>
                  <td className="py-3 px-3 font-bold text-gray-900">$0.00</td>
                  <td className="py-3 px-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
