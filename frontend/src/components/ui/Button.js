import React from 'react';
import clsx from 'clsx';

const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm';
const variants = {
  primary: 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-sm',
  outline: 'border border-base-border bg-transparent hover:bg-white/10 text-base-fg',
  ghost: 'bg-transparent hover:bg-white/10 text-base-fg',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};
const sizes = { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-12 px-6', icon: 'h-8 w-8 p-0' };

const Button = ({ as:Comp='button', variant='primary', size='md', className, ...props }) => (
  <Comp className={clsx(base, variants[variant], sizes[size], className)} {...props} />
);
export default Button;