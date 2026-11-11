import React from 'react';
import { Sprout, AlertTriangle, Info } from 'lucide-react';

export function LoadingScreen({ message = 'Analyzing agricultural data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-forest-100 border-t-forest-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-7 h-7 text-forest-700 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-slate-800">AgroAI Intelligence Processing</h4>
        <p className="text-sm text-slate-500 max-w-sm">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, actionText, onAction, icon: Icon = Sprout }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-sm font-semibold text-forest-700 hover:text-forest-800 underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function AdvisoryWarning({ warnings = [], expertRequired = false }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <div className={`rounded-xl p-4 border space-y-2 ${
      expertRequired ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center gap-2 font-semibold text-sm">
        {expertRequired ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-slate-600 shrink-0" />
        )}
        <span>Agricultural Advisory Notice</span>
      </div>
      <ul className="text-xs list-disc list-inside space-y-1 text-slate-700">
        {warnings.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
      {expertRequired && (
        <p className="text-xs font-medium text-amber-800 pt-1">
          ⚠️ Expert verification recommended: Contact your nearest Krishi Vigyan Kendra (KVK) or district agricultural extension officer before major chemical expenditure.
        </p>
      )}
    </div>
  );
}

