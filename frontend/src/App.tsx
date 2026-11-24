import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SectionPage from './pages/SectionPage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import WriteArticlePage from './pages/WriteArticlePage';
import SearchPage from './pages/SearchPage';
import BookmarksPage from './pages/BookmarksPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NewsCornerPage from './pages/NewsCornerPage';
import SupportPage from './pages/SupportPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import CrosswordsPage from './pages/CrosswordsPage';
import SubmitTipsPage from './pages/SubmitTipsPage';
import AboutPage from './pages/AboutPage';
import AudioVideoPage from './pages/AudioVideoPage';
import NewslettersPage from './pages/NewslettersPage';
import TodaysPaperPage from './pages/TodaysPaperPage';
import ArchivePage from './pages/ArchivePage';
import HolidaysPage from './pages/HolidaysPage';
import LicensingPage from './pages/LicensingPage';
import LiveEventsPage from './pages/LiveEventsPage';
import AppsPage from './pages/AppsPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#ffe500] selection:text-[#052962]">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone Auth Routes (without standard header/footer) */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Main Application with Header and Footer Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news-corner" element={<NewsCornerPage />} />
            <Route path="/section/:slug" element={<SectionPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/write" element={<WriteArticlePage />} />
            <Route path="/edit/:id" element={<WriteArticlePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/author/:username" element={<AuthorProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/crosswords" element={<CrosswordsPage />} />
            <Route path="/submit-tips" element={<SubmitTipsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/audio-video" element={<AudioVideoPage />} />
            <Route path="/newsletters" element={<NewslettersPage />} />
            <Route path="/todays-paper" element={<TodaysPaperPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path="/licensing" element={<LicensingPage />} />
            <Route path="/events" element={<LiveEventsPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
