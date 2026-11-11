import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-forest-600 hover:bg-forest-700 text-white focus:ring-forest-500 shadow-sm shadow-forest-200',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-forest-500 shadow-sm',
    accent: 'bg-harvest-500 hover:bg-harvest-600 text-slate-950 font-semibold focus:ring-harvest-400',
    outline: 'border border-forest-600 text-forest-700 hover:bg-forest-50 focus:ring-forest-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function Input({ label, error, helperText, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Select({ label, error, helperText, options = [], className = '', id, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Textarea({ label, error, helperText, className = '', id, rows = 3, ...props }) {
  const areaId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={areaId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 ${
          error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Badge({ children, variant = 'forest', className = '' }) {
  const variants = {
    forest: 'bg-forest-100 text-forest-800 border-forest-200',
    harvest: 'bg-harvest-100 text-harvest-900 border-harvest-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.forest
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

