import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../common/UIComponents.jsx';
import {
  Sprout,
  Compass,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export function WelcomeCard({ profile, completionPercent }) {
  const farmerName = profile?.full_name || 'Farmer';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-800 to-forest-900 text-white p-6 sm:p-8 shadow-sm">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-700/80 text-forest-200 border border-forest-600/50">
          <Sparkles className="w-3.5 h-3.5 text-harvest-400" />
          <span>Intelligent Agricultural Advisor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Namaste, {farmerName}!
        </h1>
        <p className="text-sm text-forest-100 leading-relaxed">
          Welcome to your farm intelligence dashboard. Generate personalized crop recommendations, analyze soil nutrients, or inspect leaf diseases in seconds.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-forest-800/80 px-3.5 py-1.5 rounded-lg border border-forest-700">
            <span className="text-forest-300">Profile Readiness:</span>
            <span className="font-bold text-harvest-300">{completionPercent}%</span>
          </div>
          {profile?.state && (
            <div className="flex items-center gap-1.5 text-forest-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{profile.district ? `${profile.district}, ` : ''}{profile.state}</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative leaf watermarks */}
      <Sprout className="absolute -right-8 -bottom-8 w-60 h-60 text-white/5 pointer-events-none" />
    </div>
  );
}

export function StatisticsCard({ title, value, subtitle, icon: Icon, color = 'forest', href }) {
  const colors = {
    forest: 'bg-forest-100 text-forest-700',
    harvest: 'bg-harvest-100 text-harvest-700',
    blue: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
  };

  const cardContent = (
    <Card hover className="flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color] || colors.forest}`}>
        <Icon className="w-5 h-5" />
      </div>
    </Card>
  );

  return href ? <Link to={href}>{cardContent}</Link> : cardContent;
}

export function QuickActionCard() {
  const actions = [
    { title: 'Crop Advisory', desc: 'Find best crops for season & soil', icon: Compass, path: '/crop-recommendation', color: 'text-forest-700 bg-forest-50' },
    { title: 'Soil Health', desc: 'Analyze NPK & get conditioning plan', icon: FlaskConical, path: '/soil-analysis', color: 'text-harvest-700 bg-harvest-50' },
    { title: 'Disease Scanner', desc: 'Upload leaf photo to diagnose pests', icon: Bug, path: '/disease-detection', color: 'text-rose-700 bg-rose-50' },
    { title: 'Fertilizer Guide', desc: 'Calculate stage-wise nutrient dosage', icon: Wheat, path: '/fertilizer-advisory', color: 'text-amber-700 bg-amber-50' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Agricultural Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Link
              key={i}
              to={act.path}
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-forest-500 hover:shadow-sm transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-forest-600 group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition">{act.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function RecentAdvisoriesList({ activities = [] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Recent Advisory Records</h3>
        <Link to="/history" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
          View all history <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">
          No advisory reports generated yet. Start with a Crop or Soil advisory above!
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.map((act, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                  {act.type === 'crop_recommendation' ? '🌾' : act.type === 'disease_report' ? '🔬' : '🧪'}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{act.title}</h4>
                  <p className="text-xs text-slate-500">{act.subtitle}</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                {new Date(act.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function UpcomingTasksList({ tasks = [] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Crop Cultivation Tasks</h3>
        <Link to="/cultivation-calendar" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
          View Calendar <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">
          No active crop calendars. Generate one to view upcoming field tasks!
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{task.cropName}: {task.stage}</span>
                  <Badge variant={task.importance === 'critical' ? 'rose' : 'harvest'}>{task.importance}</Badge>
                </div>
                <p className="text-slate-600">{task.description}</p>
              </div>
              <span className="font-semibold text-slate-500 shrink-0">{task.dayRange}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

