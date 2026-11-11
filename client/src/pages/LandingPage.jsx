import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Button, Card } from '../components/common/UIComponents.jsx';
import {
  Compass,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  Calendar,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      title: 'Precision Crop Recommendation',
      desc: 'Matches your specific soil pH, N-P-K, climate, and season against regional agro-climatic databases.',
      icon: Compass,
      color: 'text-forest-700 bg-forest-100',
    },
    {
      title: 'Soil Health & Fertility Analysis',
      desc: 'Diagnose nutrient deficiencies, determine organic carbon needs, and get corrective conditioning plans.',
      icon: FlaskConical,
      color: 'text-amber-700 bg-amber-100',
    },
    {
      title: 'Multimodal Disease & Pest Scanner',
      desc: 'Upload leaf or crop photos to detect fungal, bacterial, or insect damage with biological IPM remediation.',
      icon: Bug,
      color: 'text-rose-700 bg-rose-100',
    },
    {
      title: 'Phenological Fertilizer Timing',
      desc: 'Calculate exact stage-by-stage NPK split applications avoiding wasteful chemical over-expenditure.',
      icon: Wheat,
      color: 'text-harvest-700 bg-harvest-100',
    },
    {
      title: 'Smart Water & Irrigation Guide',
      desc: 'Optimize watering intervals based on crop evapotranspiration, soil retention, and rainfall timing.',
      icon: Droplets,
      color: 'text-blue-700 bg-blue-100',
    },
    {
      title: 'Cultivation Activity Timeline',
      desc: 'Interactive step-by-step farming calendars from seed treatment and sowing through post-harvest storage.',
      icon: Calendar,
      color: 'text-purple-700 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-forest-500 animate-ping" />
          Powered by Google Gemini 2.5 Flash & Precision Agronomy Models
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Smart Farming Starts with <span className="text-forest-600 underline decoration-harvest-400">Smarter Decisions</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Get personalized crop recommendations, soil insights, irrigation guidance, and AI-powered agricultural support for better farming decisions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to={user ? '/dashboard' : '/register'}>
            <Button size="lg" variant="primary" icon={ArrowRight}>
              {t('getStarted')}
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="secondary">
              {t('exploreFeatures')}
            </Button>
          </a>
        </div>

        {/* Hero Metric Badges */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-2xl font-bold text-forest-700">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Customized to Your Soil & Plot</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-2xl font-bold text-forest-700">IPM-First</div>
            <div className="text-xs text-slate-500 mt-0.5">Biological & Organic Prioritization</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-2xl font-bold text-forest-700">Multilingual</div>
            <div className="text-xs text-slate-500 mt-0.5">Kannada, Hindi & English Native</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-2xl font-bold text-forest-700">Zero Guesswork</div>
            <div className="text-xs text-slate-500 mt-0.5">Grounded Agricultural Logic</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-forest-700 uppercase tracking-widest">Core Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Agricultural Intelligence Suite</h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Everything a farmer or farm manager needs to reduce input costs, boost crop health, and mitigate climate risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Card key={i} hover className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-forest-700 uppercase tracking-widest">Simple Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How AgroAI Empowers Your Farming</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-black text-sm flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Enter Land & Field Data</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your location, soil type, available water, or upload a photo of affected crop leaves.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-black text-sm flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Agronomic Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Gemini AI engine cross-references agronomic guidelines, pest databases, and soil stoichiometry.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-black text-sm flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Take Action & Save Costs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive practical step-by-step advice, print reports for field workers, or chat with the AI Agronomist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Transform Your Crop Yields?</h2>
          <p className="text-sm text-forest-200 max-w-xl mx-auto leading-relaxed">
            Join forward-thinking farmers across India using AgroAI to select resilient crops and optimize fertilizer costs.
          </p>
          <Link to="/register">
            <Button size="lg" variant="accent" icon={ArrowRight}>
              Create Free Account Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

