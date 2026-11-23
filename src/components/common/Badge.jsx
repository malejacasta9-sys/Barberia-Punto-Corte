import React from 'react';
import { ESTADO_COLORS } from '../../utils/constants';

export function Badge({ children, variant = 'default', estado = null, className = '' }) {
  if (estado && ESTADO_COLORS[estado]) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${ESTADO_COLORS[estado]} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
        {children || estado}
      </span>
    );
  }

  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    gold: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
