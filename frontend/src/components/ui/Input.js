import React from 'react';
import clsx from 'clsx';

const base = 'w-full px-3 py-2 rounded-md bg-slate-900/40 dark:bg-slate-800/60 border border-white/10 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 outline-none text-sm placeholder:text-base-fg/40';

export const Input = ({ label, id, error, className, as:Comp='input', ...props }) => {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label && <span className="text-base-fg/80" htmlFor={id}>{label}</span>}
      <Comp id={id} className={clsx(base, error && 'border-red-500 focus:ring-red-400', className)} {...props} />
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </label>
  );
};

export default Input;