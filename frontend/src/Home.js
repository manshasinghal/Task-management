import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import toast, { Toaster } from 'react-hot-toast';

// Badge component for status
const StatusBadge = ({ status }) => {
  const map = {
    'todo': 'bg-slate-600/60 text-slate-200 border-slate-400/30',
    'in-progress': 'bg-amber-600/60 text-amber-50 border-amber-400/40',
    'done': 'bg-emerald-600/60 text-emerald-50 border-emerald-400/40 line-through decoration-emerald-200/60'
  };
  return <span className={`text-[10px] tracking-wide font-semibold px-2 py-1 rounded-md border ${map[status]}`}>{status.replace('-', ' ')}</span>;
};

const Task = ({ task, index, editTaskId, editTaskText, setEditTaskId, setEditTaskText, handleEditTask, handleDeleteClick, setStatusInline }) => {
  return (
    <li
      style={{ animationDelay: `${index * 40}ms` }}
      className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-md p-5 flex flex-col gap-4 shadow-lg shadow-black/30 overflow-hidden animate-[fadeIn_.6s_ease_forwards] opacity-0"
    >
      <div className="absolute inset-px rounded-[inherit] bg-[linear-gradient(140deg,rgba(255,255,255,0.15),rgba(255,255,255,0)_40%)] pointer-events-none" />
      {editTaskId === task._id ? (
        <form onSubmit={handleEditTask} className="flex flex-col gap-3">
          <input
            type="text"
            value={editTaskText}
            onChange={(e) => setEditTaskText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-fuchsia-400/40 focus:ring-2 focus:ring-fuchsia-500/40 outline-none text-indigo-50 text-sm"
          />
          <div className="flex gap-2 text-xs">
            <button type="submit" className="px-3 py-2 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition">Save</button>
            <button type="button" onClick={() => { setEditTaskId(null); setEditTaskText(''); }} className="px-3 py-2 rounded-md bg-slate-600 text-white font-semibold hover:bg-slate-500 transition">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <p className={`text-indigo-50 text-sm leading-relaxed pr-1 flex-1 ${task.status === 'done' ? 'line-through decoration-indigo-300/40' : ''}`}>{task.task}</p>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={task.status} />
              <select
                value={task.status}
                onChange={(e) => setStatusInline(task._id, e.target.value)}
                className="text-[10px] bg-slate-900/70 text-indigo-100 border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
              >
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-300/60 mt-auto">
            <div className="flex flex-col gap-0.5">
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
              {task.modifiedAt && <span className="italic text-pink-200/70">Edited: {new Date(task.modifiedAt).toLocaleDateString()}</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditTaskId(task._id); setEditTaskText(task.task); }}
                className="px-3 py-1 rounded-md bg-indigo-500/70 text-white font-medium hover:bg-indigo-500 transition shadow-sm shadow-indigo-500/30"
              >Edit</button>
              <button
                onClick={() => handleDeleteClick(task._id)}
                className="px-3 py-1 rounded-md bg-rose-600/80 text-white font-medium hover:bg-rose-600 transition shadow-sm shadow-rose-600/30"
              >Delete</button>
            </div>
          </div>
        </>
      )}
    </li>
  );
};

const Home = ({ user, userId, setUser }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      if (userId) {
        setLoadingTasks(true);
        const response = await api.get(`/tasks/${userId}`);
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [userId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) {
      toast.error('Task cannot be empty');
      return;
    }
    try {
      setAdding(true);
      await api.post(`/tasks/${userId}`, { task: newTaskText, status: newTaskStatus });
      toast.success('Task added');
      setNewTaskText('');
      setNewTaskStatus('todo');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setAdding(false);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editTaskText.trim()) { toast.error('Task cannot be empty'); return; }
    try {
      await api.patch(`/tasks/${editTaskId}`, { task: editTaskText, status: newTaskStatus });
      toast.success('Task updated');
      setEditTaskId(null);
      setEditTaskText('');
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Failed to edit');
    }
  };

  const setStatusInline = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}`, { status });
      toast.success('Status updated');
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    } catch (e) {
      toast.error('Status change failed');
    }
  };

  const handleDeleteClick = (taskId) => { setTaskToDeleteId(taskId); setShowDeleteModal(true); };
  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${taskToDeleteId}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Delete failed');
    } finally {
      setShowDeleteModal(false); setTaskToDeleteId(null);
    }
  };
  const cancelDelete = () => { setShowDeleteModal(false); setTaskToDeleteId(null); };

  const handleLogout = () => { setUser(null); setTasks([]); };

  return (
    <div className="flex flex-col space-y-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e2f', color: '#f5f5f7', fontSize: '12px' } }} />
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 to-indigo-200 tracking-tight">Dashboard</h2>
          <p className="text-xs sm:text-sm text-indigo-100/70 mt-1">Welcome back{user?.email ? `, ${user.email}` : ''}! Stay organized.</p>
        </div>
        <button onClick={handleLogout} className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full shadow hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all">Logout</button>
      </div>

      {/* Add Task Card */}
      <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 shadow-xl shadow-black/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,theme(colors.indigo.400),transparent_60%),radial-gradient(circle_at_bottom_right,theme(colors.fuchsia.500),transparent_60%)]" />
        <form onSubmit={handleAddTask} className="relative grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="sm:col-span-3 flex-grow px-4 py-3 rounded-xl bg-slate-900/40 border border-white/10 focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-500/40 outline-none text-indigo-50 placeholder:text-indigo-300/40 text-sm"
          />
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            className="sm:col-span-1 px-3 py-3 rounded-xl bg-slate-900/40 border border-white/10 text-indigo-100 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
          >
            <option value="todo">todo</option>
            <option value="in-progress">in-progress</option>
            <option value="done">done</option>
          </select>
          <button
            type="submit"
            disabled={adding}
            className="sm:col-span-1 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500 text-white shadow hover:shadow-fuchsia-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
          {adding ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Tasks Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-100/90 flex items-center gap-2">Your Tasks <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-50/80">{tasks.length}</span></h3>
          {loadingTasks && <span className="text-[10px] uppercase tracking-wide text-indigo-200/60 animate-pulse">Refreshing...</span>}
        </div>
        {tasks.length === 0 && !loadingTasks && (
          <div className="text-center text-indigo-200/60 text-sm border border-dashed border-indigo-400/30 rounded-2xl p-10 bg-indigo-950/20">
            <p className="mb-2 font-medium">No tasks yet</p>
            <p className="text-xs">Add your first task to kickstart productivity.</p>
          </div>
        )}
        <ul className="grid gap-4 md:grid-cols-2">
          {tasks.map((task, index) => (
            <Task
              key={task._id}
              task={task}
              index={index}
              editTaskId={editTaskId}
              editTaskText={editTaskText}
              setEditTaskId={setEditTaskId}
              setEditTaskText={setEditTaskText}
              handleEditTask={handleEditTask}
              handleDeleteClick={handleDeleteClick}
              setStatusInline={setStatusInline}
            />
          ))}
        </ul>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/80 to-slate-800/70 p-8 shadow-2xl shadow-black/50 relative">
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_65%)]" />
            <h3 className="text-lg font-bold text-pink-100 mb-2">Delete Task?</h3>
            <p className="text-xs text-indigo-200/70 mb-6 leading-relaxed">This action cannot be undone. You will permanently remove this task from your list.</p>
            <div className="flex justify-end gap-3 text-xs font-semibold">
              <button onClick={cancelDelete} className="px-4 py-2 rounded-md bg-slate-600/70 text-white hover:bg-slate-500 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-gradient-to-r from-rose-500 to-red-600 text-white hover:brightness-110 transition shadow shadow-rose-600/30">Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Home;