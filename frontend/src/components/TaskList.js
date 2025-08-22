import React, { useState, useEffect } from 'react';
import api from '../api';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import { toast } from 'react-hot-toast';

const TaskList = ({ tasks, onTaskAction, loading, onEdit }) => {
  const [localTasks, setLocalTasks] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    const prev = localTasks;
    setLocalTasks(t => t.map(tsk => tsk._id === taskId ? { ...tsk, status: newStatus } : tsk));
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
      setLocalTasks(prev); // revert
    }
  };

  const toggleMenu = (id) => setOpenMenuId(m => m === id ? null : id);
  const closeMenu = () => setOpenMenuId(null);

  useEffect(() => {
    const handler = (e) => { if (!e.target.closest('[data-task-menu]')) closeMenu(); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-3">
            <Skeleton variant="title" className="w-2/3" />
            <Skeleton className="w-full" />
            <Skeleton className="w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!localTasks.length) return <p className="text-base-fg/60">No tasks found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localTasks.map(task => (
        <article key={task._id} className="group bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/10 text-white flex flex-col gap-3 relative" aria-labelledby={`task-${task._id}-title`}>
          <header className="flex items-start justify-between gap-2">
            <h4 id={`task-${task._id}-title`} className="text-base font-semibold truncate-title" title={task.title}>{task.title}</h4>
            <Badge status={task.status} />
          </header>
          <p className="text-xs text-base-fg/70 line-clamp-3 min-h-[48px]">{task.description || 'No description.'}</p>
          <div className="mt-auto flex items-center justify-between text-[11px] text-base-fg/60">
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            <span title={task.assignedTo?.name}>@{task.assignedTo?.name || 'N/A'}</span>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <label className="sr-only" htmlFor={`status-${task._id}`}>Change status</label>
            <select
              id={`status-${task._id}`}
              className="px-2 py-1 rounded-md bg-slate-900/60 border border-white/10 text-xs focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
              value={task.status}
              onChange={(e) => handleStatusChange(task._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="hidden sm:flex gap-2 ml-auto">
              <Button size="sm" variant="ghost" onClick={() => onEdit(task)} aria-label="Edit task">Edit</Button>
            </div>
            {/* Mobile menu */}
            <div className="sm:hidden ml-auto relative" data-task-menu>
              <Button size="icon" variant="ghost" aria-haspopup="menu" aria-expanded={openMenuId === task._id} onClick={(e) => { e.stopPropagation(); toggleMenu(task._id); }}>⋮</Button>
              {openMenuId === task._id && (
                <div role="menu" className="absolute top-8 right-0 bg-slate-900/90 border border-white/10 rounded-md shadow-lg py-1 text-sm min-w-[120px] z-20">
                  <button role="menuitem" onClick={() => { onEdit(task); closeMenu(); }} className="w-full text-left px-3 py-2 hover:bg-white/10">Edit</button>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default TaskList;
