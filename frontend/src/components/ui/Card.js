import React from 'react';
import clsx from 'clsx';

const Card = ({ as:Comp='div', className, children, padding='p-4', ...props }) => (
  <Comp className={clsx('bg-white/5 dark:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-sm', padding, className)} {...props}>{children}</Comp>
);
export default Card;