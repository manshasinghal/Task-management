import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ open, onClose, title, children, actions }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900/90 dark:bg-slate-800/90 border border-white/10 rounded-xl shadow-xl p-6 animate-[fadeIn_.2s_ease] text-base-fg">
        <div className="flex items-start justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>✕</Button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
};
export default Modal;