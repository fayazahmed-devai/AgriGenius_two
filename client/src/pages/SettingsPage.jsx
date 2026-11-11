import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Card, Button, Select, Input } from '../components/common/UIComponents.jsx';
import { Settings, Globe, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user, resetPassword } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [passwordEmail, setPasswordEmail] = useState(user?.email || '');
  const [pwMessage, setPwMessage] = useState(null);
  const [pwError, setPwError] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);

    try {
      await resetPassword(passwordEmail);
      setPwMessage('Password reset link sent to your registered email address.');
    } catch (err) {
      setPwError(err.message || 'Failed to send password reset link.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-forest-600" /> Account Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your localized language preferences, authentication security, and agricultural privacy controls.
        </p>
      </div>

      {/* Language Preference */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-forest-600" /> Vernacular Language Selection
        </h3>
        <p className="text-xs text-slate-600">
          All AI advisory responses, chat interactions, and form descriptions will reflect your chosen language.
        </p>

        <div className="max-w-xs">
          <Select
            label="System Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'en', label: 'English (Default)' },
              { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
              { value: 'hi', label: 'हिंदी (Hindi)' },
            ]}
          />
        </div>
      </Card>

      {/* Security & Password */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-forest-600" /> Security & Password Management
        </h3>
        <p className="text-xs text-slate-600">
          Request a secure password reset link sent directly to your registered email.
        </p>

        {pwMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pwMessage}</span>
          </div>
        )}

        {pwError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <Input
            type="email"
            value={passwordEmail}
            onChange={(e) => setPasswordEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="md">
            Send Reset Link
          </Button>
        </form>
      </Card>

      {/* Privacy Information */}
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-forest-600" /> Agricultural Privacy & Data Policy
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            • <strong>Strict Tenant Isolation:</strong> Every soil sample, leaf photo, and advisory report is guarded by Supabase Row Level Security (RLS) and is only visible to your authenticated account.
          </p>
          <p>
            • <strong>Non-commercial AI:</strong> Field images uploaded for foliar diagnosis are analyzed strictly for disease identification and are never used to train unauthorized public models.
          </p>
          <p>
            • <strong>Complete Erasure:</strong> You can permanently delete any historical advisory report or conversation at any time from the Advisory History screen.
          </p>
        </div>
      </Card>
    </div>
  );
}

