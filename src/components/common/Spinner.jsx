import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', text = 'Cargando...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-brand-500`} />
      {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
    </div>
  );
}
