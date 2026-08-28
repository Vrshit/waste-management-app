import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, logoutUser } from '@/lib/store';
import type { User } from '@/lib/types';
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Shield,
  LogOut,
  Menu,
  X,
  Leaf,
  Truck,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

const BADGE_EMOJI: Record<string, string> = {
  none: '🌱',
  reporter: '🏅',
  champion: '🏆',
  hero: '🌟',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.replace('/login');
  };

  // Loading skeleton
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
        <div className="flex items-center gap-3 text-emerald-700 bg-white/80 glass-pill px-6 py-4 rounded-2xl shadow-lg border border-emerald-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-spin">
            <Leaf size={18} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-gray-800">
            {t.loading}
          </span>
        </div>
      </div>
    );
  }

  const isOfficer = user.role === 'officer';
  const isAdmin = user.role === 'admin';

  let navItems = [
    { href: '/report', label: t.navReport, icon: Camera },
    { href: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { href: '/facilities', label: t.navFacilities, icon: MapPin },
  ];

  if (isOfficer) {
    navItems = [
      { href: '/officer', label: t.navOfficerRadar, icon: Truck },
      { href: '/facilities', label: t.navFacilities, icon: MapPin },
    ];
  } else if (isAdmin) {
    navItems = [
      { href: '/admin', label: t.navAdmin, icon: Shield },
      { href: '/facilities', label: t.navFacilities, icon: MapPin },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] text-[#192f1d] relative font-sans">
      {/* ── Background Ambient Spatial Glow ── */}
      <div
        className="fixed top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-200/30 via-lime-100/20 to-transparent blur-[130px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="fixed top-[40%] right-[-10%] w-[450px] h-[450px] bg-amber-200/20 blur-[140px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-700 focus:text-white focus:px-4 focus:py-2.5 focus:rounded-xl focus:shadow-xl font-bold text-xs"
      >
        Skip to content
      </a>

      {/* ── Floating Pill Navigation ── */}
      <div className="sticky top-4 z-50 px-4 flex justify-center w-full">
        <header className="glass-pill rounded-full px-4 py-2.5 max-w-6xl w-full flex items-center justify-between shadow-[0_10px_30px_rgba(22,101,52,0.08)] border border-white/80">
          {/* Logo & 3D Leaf Badge */}
          <Link
            href={isAdmin ? '/admin' : isOfficer ? '/officer' : '/report'}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Leaf size={20} className="drop-shadow-sm rotate-[-12deg]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-emerald-950">
              {t.brandName}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-black/[0.04]">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)]'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-white/90'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Points / Earnings Pill, Language & User */}
          <div className="flex items-center gap-2.5">
            {/* Role Metric Badge */}
            {isOfficer ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                <Wallet size={13} className="text-amber-700" />
                <span>₹{user.officerEarnings || 1250}</span>
              </div>
            ) : isAdmin ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-purple-100/90 text-purple-900 border border-purple-300 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                <Shield size={13} className="text-purple-700" />
                <span>Admin Authority</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                <Sparkles size={13} className="text-emerald-700" />
                <span>{user.civicPoints || 50} pts</span>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-black/[0.04] rounded-full p-0.5 text-xs font-black">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  lang === 'en' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  lang === 'hi' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* User Profile / Logout */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <span className="text-xs font-black text-gray-800 max-w-[120px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center transition shadow-xs"
                title={t.navLogout}
              >
                <LogOut size={14} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-gray-200 z-50 flex flex-col gap-2 md:hidden">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>{t.navLogout}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content Area ── */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="border-t border-black/[0.06] py-6 px-4 text-center text-xs text-gray-500">
        <p>© 2026 SwachhApp. Clean Green Future Mission • Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
