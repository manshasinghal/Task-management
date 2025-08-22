import React from 'react';
import clsx from 'clsx';

const colorMap = {
  pending: 'badge-status badge-status-pending',
  'in-progress': 'badge-status badge-status-inprogress',
  completed: 'badge-status badge-status-completed'
};

const Badge = ({ status, children, className }) => {
  const cls = colorMap[status] || 'badge-status';
  return <span className={clsx(cls, className)}>{children || status}</span>;
};

export default Badge;