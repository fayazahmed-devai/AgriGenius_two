import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Input, Select, Card } from '../components/common/UIComponents.jsx';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Agricultural Advisory.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName, preferredLanguage);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.svg" alt="AgroAI Logo" className="w-10 h-10" />
            <span className="text-2xl font-black text-forest-800">Agro<span className="text-harvest-600">AI</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Farmer Account</h2>
          <p className="text-xs text-slate-500">Join thousands of farmers making smarter agricultural decisions</p>
        </div>

        <Card className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Patil"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
            />

            <Select
              label="Preferred Language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { value: 'hi', label: 'हिंदी (Hindi)' },
                { value: 'te', label: 'తెలుగు (Telugu)' },
                { value: 'ta', label: 'தமிழ் (Tamil)' },
                { value: 'mr', label: 'मराठी (Marathi)' },
              ]}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
            />

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600">
                I understand that AgroAI recommendations are advisory and designed to augment certified local agronomic consultation.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={loading} icon={UserPlus}>
              Create My Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-700 hover:text-forest-800 underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

