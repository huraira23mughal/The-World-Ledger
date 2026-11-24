import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Upload, X, CheckCircle, CreditCard, Star, FileText, DollarSign } from 'lucide-react';
import { articlesApi, categoriesApi, imagesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Category } from '../types';

type Step = 'write' | 'type' | 'pay';

export default function WriteArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('write');
  const [savedArticleId, setSavedArticleId] = useState<string | null>(id || null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
    kicker: '',
    readTime: '5 min read',
    featuredImageUrl: '',
    imageCaption: '',
    tagNames: [] as string[],
    isPremium: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');

  // Payment state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (id) {
      articlesApi.getById(id).then(({ data }) => {
        setForm({
          title: data.title,
          summary: data.summary,
          content: data.content,
          categoryId: data.category?.id || '',
          kicker: data.kicker || '',
          readTime: data.readTime,
          featuredImageUrl: data.featuredImageUrl || '',
          imageCaption: data.imageCaption || '',
          tagNames: data.tags?.map((t: any) => t.name) || [],
          isPremium: data.isPremium || false,
        });
        if (data.status === 'Draft') setSavedArticleId(data.id);
      });
    }
  }, [id]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tagNames.includes(tag)) {
      setForm(f => ({ ...f, tagNames: [...f.tagNames, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setForm(f => ({ ...f, tagNames: f.tagNames.filter(t => t !== tag) }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const { data } = await imagesApi.upload(file, form.imageCaption);
      setForm(f => ({ ...f, featuredImageUrl: data.url }));
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  // Step 1 → Save as draft and move to type selection
  const handleSaveDraft = async () => {
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.summary.trim()) return setError('Summary is required.');
    if (!form.content.trim()) return setError('Content is required.');
    if (!form.categoryId) return setError('Please select a category.');

    setLoading(true);
    try {
      const payload = { ...form, isDraft: true };
      let artId = savedArticleId;
      if (artId) {
        await articlesApi.update(artId, payload);
      } else {
        const { data } = await articlesApi.create(payload);
        artId = data.id;
        setSavedArticleId(artId);
      }
      setStep('type');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save article.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Confirm type, go to payment
  const handleProceedToPay = () => {
    setStep('pay');
  };

  // Step 3 → Payment + publish
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedArticleId) return;
    setPayError('');
    setPayLoading(true);
    try {
      await articlesApi.publishWithPayment(savedArticleId, {
        cardLastFour: cardNumber.slice(-4) || '0000',
        amount: form.isPremium ? 25 : 25,
        currency: 'USD',
      });
      setPublished(true);
    } catch (err: any) {
      setPayError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  if (published) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
        <h2 className="font-serif text-3xl font-bold text-[#052962] mb-2">Article Published!</h2>
        <p className="text-gray-500 mb-6">Your article is now live on The World Ledger.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-[#052962] text-white px-6 py-2.5 text-sm font-bold rounded hover:bg-blue-900"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => { setPublished(false); setStep('write'); setForm(f => ({ ...f, title: '', summary: '', content: '' })); setSavedArticleId(null); }}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 text-sm font-bold rounded hover:bg-gray-100"
          >
            Write Another
          </button>
        </div>
      </div>
    );
  }

  // Step indicator
  const steps = [
    { key: 'write', label: 'Write', icon: <FileText size={16} /> },
    { key: 'type', label: 'Article Type', icon: <Star size={16} /> },
    { key: 'pay', label: 'Pay & Publish', icon: <DollarSign size={16} /> },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#052962]">{id ? 'Edit Article' : 'Write an Article'}</h1>
          <p className="text-gray-500 mt-1">Writing as <strong>{user?.fullName}</strong></p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                step === s.key
                  ? 'bg-[#052962] text-white'
                  : (steps.findIndex(x => x.key === step) > i)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {s.icon} {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${steps.findIndex(x => x.key === step) > i ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 1: WRITE ── */}
        {step === 'write' && (
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section / Category *</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
              >
                <option value="">Select a section...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Kicker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kicker (optional)</label>
              <input
                type="text"
                value={form.kicker}
                onChange={e => setForm(f => ({ ...f, kicker: e.target.value }))}
                placeholder="e.g. Exclusive, Breaking, Analysis"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Headline *</label>
              <textarea
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                rows={2}
                placeholder="Write a compelling headline..."
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] font-serif text-xl resize-none rounded"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Standfirst / Summary *</label>
              <textarea
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                rows={3}
                placeholder="A brief summary that draws readers in..."
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image</label>
              {form.featuredImageUrl ? (
                <div className="relative">
                  <img src={form.featuredImageUrl} alt="Featured" className="w-full h-48 object-cover rounded" />
                  <button
                    onClick={() => setForm(f => ({ ...f, featuredImageUrl: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <input type="url" value={form.featuredImageUrl} onChange={e => setForm(f => ({ ...f, featuredImageUrl: e.target.value }))} placeholder="Paste image URL..." className="w-full border border-gray-300 px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#052962] rounded" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="flex items-center gap-2 text-sm border border-dashed border-gray-400 px-4 py-2 hover:border-[#052962] hover:text-[#052962] transition-colors rounded"
                  >
                    {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {imageUploading ? 'Uploading...' : 'Upload from device'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              )}
              <input
                type="text"
                value={form.imageCaption}
                onChange={e => setForm(f => ({ ...f, imageCaption: e.target.value }))}
                placeholder="Image caption (optional)"
                className="mt-2 w-full border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#052962] rounded"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Article Body *</label>
              <p className="text-xs text-gray-400 mb-2">HTML is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;em&gt; tags.</p>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={16}
                placeholder="<p>Write your article here...</p>"
                className="w-full border border-gray-300 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#052962] resize-y rounded"
              />
            </div>

            {/* Read time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Read Time</label>
              <input
                type="text"
                value={form.readTime}
                onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                placeholder="5 min read"
                className="w-48 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tagNames.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                />
                <button onClick={addTag} className="bg-gray-200 text-gray-700 px-3 py-2 text-sm hover:bg-gray-300 rounded">Add</button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex-1 bg-[#052962] text-white py-3 font-semibold text-sm hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 rounded"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Save & Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: SELECT ARTICLE TYPE ── */}
        {step === 'type' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#052962] mb-1">Choose Article Type</h2>
              <p className="text-gray-500 text-sm">Select whether this is a free or premium article. Payment of <strong>$25</strong> is required to publish.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setForm(f => ({ ...f, isPremium: false }))}
                className={`border-2 rounded-xl p-6 text-left transition ${
                  !form.isPremium ? 'border-[#052962] bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} className="text-[#052962]" />
                  <span className="font-bold text-[#052962]">Free Article</span>
                  {!form.isPremium && <span className="ml-auto text-xs bg-[#052962] text-white px-2 py-0.5 rounded-full">Selected</span>}
                </div>
                <p className="text-xs text-gray-600">Anyone can read this article without signing in. Great for maximum reach and audience building.</p>
                <p className="text-sm font-bold text-gray-700 mt-3">Publishing fee: $25</p>
              </button>

              <button
                onClick={() => setForm(f => ({ ...f, isPremium: true }))}
                className={`border-2 rounded-xl p-6 text-left transition ${
                  form.isPremium ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star size={20} className="text-amber-500 fill-amber-400" />
                  <span className="font-bold text-amber-700">Premium Article</span>
                  {form.isPremium && <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Selected</span>}
                </div>
                <p className="text-xs text-gray-600">Only active subscribers can read the full article. Ideal for in-depth investigations and exclusive analysis.</p>
                <p className="text-sm font-bold text-gray-700 mt-3">Publishing fee: $25</p>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Article summary:</strong> "{form.title}"
              <br />
              <span className="text-xs text-blue-600">Type: {form.isPremium ? '⭐ Premium (subscribers only)' : '🌐 Free (open access)'} · Publishing fee: $25</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('write')}
                className="border border-gray-300 text-gray-600 px-6 py-3 font-semibold text-sm hover:bg-gray-100 rounded"
              >
                ← Back
              </button>
              <button
                onClick={handleProceedToPay}
                className="flex-1 bg-[#052962] text-white py-3 font-semibold text-sm hover:bg-blue-900 rounded flex items-center justify-center gap-2"
              >
                <CreditCard size={16} /> Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === 'pay' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#052962] mb-1">Complete Payment to Publish</h2>
              <p className="text-gray-500 text-sm">Your article will be published immediately after successful payment.</p>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Order Summary</h3>
              <div className="flex items-start gap-3">
                {form.isPremium
                  ? <Star size={18} className="text-amber-500 fill-amber-400 mt-0.5 shrink-0" />
                  : <FileText size={18} className="text-[#052962] mt-0.5 shrink-0" />}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800 line-clamp-1">{form.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{form.isPremium ? 'Premium Article' : 'Free Article'} · Editorial Review & Publishing</p>
                </div>
                <span className="font-bold text-[#052962] text-lg">$25.00</span>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded font-mono tracking-widest"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="12/27"
                    maxLength={5}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052962] rounded"
                    required
                  />
                </div>
              </div>

              {payError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">{payError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="border border-gray-300 text-gray-600 px-6 py-3 font-semibold text-sm hover:bg-gray-100 rounded"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="flex-1 bg-green-600 text-white py-3 font-bold text-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 rounded"
                >
                  {payLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                  {payLoading ? 'Processing...' : 'Pay $25.00 & Publish'}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                🔒 Secure payment · Article will be published immediately upon success
              </p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
