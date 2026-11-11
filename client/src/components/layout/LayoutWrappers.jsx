import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navbar, Sidebar } from './NavAndSidebar.jsx';
import { Loader2 } from 'lucide-react';

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} isMobileOpen={isMobileOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
        <main className="flex-1 lg:pl-64 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-700">
            🌾 AgroAI - Intelligent Agriculture Crop Advisory Assistant &copy; {new Date().getFullYear()}
          </p>
          <p className="max-w-2xl mx-auto text-[11px] text-slate-400">
            Agricultural Notice: AI recommendations are advisory and designed to augment, not replace, certified laboratory soil tests and official agronomic extension advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-forest-700 font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

