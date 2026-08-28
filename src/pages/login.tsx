import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  loginCitizenWithAadhar,
  loginOfficerWithEmployerId,
  loginAdminWithPasskey,
  getCurrentUser,
  ensureDemoAccounts,
} from '@/lib/store';
import {
  CreditCard,
  Truck,
  Shield,
  Zap,
  Lock,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

type LoginTab = 'citizen' | 'officer' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<LoginTab>('citizen');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Citizen Aadhaar state
  const [aadharNumber, setAadharNumber] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Officer state
  const [employerId, setEmployerId] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');

  // Admin state
  const [adminPasskey, setAdminPasskey] = useState('');

  useEffect(() => {
    ensureDemoAccounts();
    const currentUser = getCurrentUser();
    if (currentUser) {
      if (currentUser.role === 'admin') router.replace('/admin');
      else if (currentUser.role === 'officer') router.replace('/officer');
      else router.replace('/report');
    }
  }, [router]);

  // Format Aadhaar with dashes
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = raw;
    if (raw.length > 8) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
    } else if (raw.length > 4) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    }
    setAadharNumber(formatted);
  };

  // Submit Handlers
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      loginCitizenWithAadhar(aadharNumber, citizenOtp || '123456', citizenName || 'Aarav Sharma');
      router.push('/report');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      loginOfficerWithEmployerId(employerId, officerPassword || 'officer123');
      router.push('/officer');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      loginAdminWithPasskey(adminPasskey || 'SWACHH-ADMIN-2026');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Handlers for Judges
  const quickDemoCitizen = () => {
    setError(null);
    loginCitizenWithAadhar('5432-9876-1234', '123456', 'Aarav Sharma');
    router.push('/report');
  };

  const quickDemoOfficer = () => {
    setError(null);
    loginOfficerWithEmployerId('EMP-KA33-902', 'officer123', 'Ramesh Kumar (Sanitation Officer)');
    router.push('/officer');
  };

  const quickDemoAdmin = () => {
    setError(null);
    loginAdminWithPasskey('SWACHH-ADMIN-2026');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#faf8f4]">
      {/* 3D Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center bg-white/90 border border-gray-200 rounded-full p-0.5 text-xs font-black shadow-sm">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full transition-all ${
              lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-full transition-all ${
              lang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="clay-card-3d w-full max-w-lg p-7 sm:p-9 relative z-10 space-y-6 bg-white">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 text-white font-black text-2xl group-hover:scale-105 transition-transform">
              🍃
            </div>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t.brandName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5">
              {t.loginSubtitle}
            </p>
          </div>
        </div>

        {/* ── 3 Role Selector Tabs ── */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-emerald-900 shadow-md border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <CreditCard size={16} className={activeTab === 'citizen' ? 'text-emerald-600' : ''} />
            <span>{lang === 'hi' ? 'नागरिक (आधार)' : 'Citizen (Aadhaar)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('officer');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'officer'
                ? 'bg-white text-emerald-900 shadow-md border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Truck size={16} className={activeTab === 'officer' ? 'text-amber-600' : ''} />
            <span>{lang === 'hi' ? 'अधिकारी (Emp ID)' : 'Officer (Emp ID)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError(null);
            }}
            className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-emerald-900 shadow-md border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Shield size={16} className={activeTab === 'admin' ? 'text-purple-600' : ''} />
            <span>{lang === 'hi' ? 'प्रशासन (पासकी)' : 'Admin (Passkey)'}</span>
          </button>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ════════ TAB 1: CITIZEN AADHAAR AUTH ════════ */}
        {activeTab === 'citizen' && (
          <form onSubmit={handleCitizenSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                {t.citizenAadharLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="5432-9876-1234"
                  value={aadharNumber}
                  onChange={handleAadharChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-black tracking-widest focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
                <CreditCard
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {lang === 'hi' ? 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI) अनुरूप' : 'UIDAI compliant 12-digit Indian citizen identity'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.citizenNameLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Aarav Sharma"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                  />
                  <UserIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {t.citizenOtpLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="123456"
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-black tracking-wider focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                  />
                  <FileCheck
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full clay-btn-green text-white font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shine-sweep-effect cursor-pointer"
            >
              <span>{t.citizenLoginBtn}</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Citizen */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={quickDemoCitizen}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition"
              >
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span>{t.citizenDemoBtn}</span>
              </button>
            </div>
          </form>
        )}

        {/* ════════ TAB 2: SANITATION OFFICER LOGIN ════════ */}
        {activeTab === 'officer' && (
          <form onSubmit={handleOfficerSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                {t.officerEmpIdLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="EMP-KA33-902"
                  value={employerId}
                  onChange={(e) => setEmployerId(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-black tracking-wider uppercase focus:bg-white focus:border-amber-500 focus:outline-none transition"
                />
                <Truck
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {lang === 'hi' ? 'नगर निगम स्वच्छता चालक / फील्ड कर्मचारी पहचान पत्र' : 'Municipal Sanitation Driver / Field Operator ID'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                {t.officerPassLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold focus:bg-white focus:border-amber-500 focus:outline-none transition"
                />
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/30 transition cursor-pointer"
            >
              <span>{t.officerLoginBtn}</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Officer */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={quickDemoOfficer}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-100 transition"
              >
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span>{t.officerDemoBtn}</span>
              </button>
            </div>
          </form>
        )}

        {/* ════════ TAB 3: MUNICIPAL ADMIN PASSKEY LOGIN ════════ */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                {t.adminPasskeyLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="SWACHH-ADMIN-2026"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-black tracking-wider focus:bg-white focus:border-purple-500 focus:outline-none transition"
                />
                <KeyRound
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {lang === 'hi' ? 'ज़ोनल कमिश्नर और नगरपालिका नियंत्रण कक्ष प्राधिकरण' : 'Zonal Commissioner & Municipal Authority single-input passkey'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition cursor-pointer"
            >
              <span>{t.adminLoginBtn}</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Admin */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={quickDemoAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition"
              >
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span>{t.adminDemoBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
