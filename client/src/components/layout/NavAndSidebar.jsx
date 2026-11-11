import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Sprout,
  LayoutDashboard,
  Compass,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  Calendar,
  Bot,
  History,
  User,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
} from 'lucide-react';

export function Navbar({ onMenuToggle, isMobileOpen }) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="AgroAI Logo" className="w-9 h-9" />
              <div>
                <span className="text-xl font-bold tracking-tight text-forest-800">Agro<span className="text-harvest-600">AI</span></span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-forest-50 text-forest-700 rounded-full border border-forest-200">Advisory</span>
              </div>
            </Link>
          </div>

          {/* Right Actions: Language Selector, User Info & Logout */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition ${language === 'en' ? 'bg-white shadow text-forest-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-2 py-1 rounded transition ${language === 'kn' ? 'bg-white shadow text-forest-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded transition ${language === 'hi' ? 'bg-white shadow text-forest-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिंदी
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-xs text-slate-700 font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-700 font-bold flex items-center justify-center">
                    {user.email ? user.email[0].toUpperCase() : 'F'}
                  </div>
                  <span className="hidden md:inline-block max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title={t('logout')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-forest-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-forest-600 hover:bg-forest-700 px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('cropRecommendation'), path: '/crop-recommendation', icon: Compass },
    { label: t('soilAnalysis'), path: '/soil-analysis', icon: FlaskConical },
    { label: t('fertilizerAdvisory'), path: '/fertilizer-advisory', icon: Wheat },
    { label: t('irrigationAdvisory'), path: '/irrigation-advisory', icon: Droplets },
    { label: t('diseaseDetection'), path: '/disease-detection', icon: Bug },
    { label: t('cultivationCalendar'), path: '/cultivation-calendar', icon: Calendar },
    { label: t('aiAssistant'), path: '/ai-assistant', icon: Bot, badge: 'AI' },
    { label: t('history'), path: '/history', icon: History },
    { label: t('profile'), path: '/profile', icon: User },
    { label: t('settings'), path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Agricultural Intelligence
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-harvest-100 text-harvest-800 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Support Card */}
        <div className="p-4 m-4 rounded-xl bg-forest-50 border border-forest-100 text-xs text-forest-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-forest-800">
            <Sprout className="w-4 h-4 text-forest-600" />
            <span>Kisan Support 24/7</span>
          </div>
          <p className="text-[11px] text-forest-700 leading-relaxed">
            Need urgent field verification? Consult our AI Assistant or reach your district agricultural extension officer.
          </p>
        </div>
      </aside>
    </>
  );
}

