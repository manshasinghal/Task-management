import React from 'react';
import clsx from 'clsx';

const variants = {
  text: 'h-3',
  title: 'h-4',
  card: 'h-24',
  avatar: 'h-10 w-10 rounded-full'
};

const Skeleton = ({ variant='text', className }) => (
  <div className={clsx('skeleton', variants[variant], className)} />
);
export default Skeleton;