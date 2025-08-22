import React, { useEffect } from 'react';
import api from '../api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import Input from './ui/Input';
import Button from './ui/Button';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().max(500, 'Max 500 characters').optional().or(z.literal('')),
  assignedTo: z.string().min(1, 'Select a user'),
  dueDate: z.string().refine(val => {
    if (!val) return false;
    const today = new Date();
    const d = new Date(val + 'T00:00:00');
    return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, { message: 'Due date cannot be in the past' }),
});

const TaskForm = ({ onTaskAction, users, taskToEdit, setTaskToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm({ resolver: zodResolver(schema), defaultValues: { title: '', description: '', assignedTo: '', dueDate: '' } });

  const todayStr = new Date().toISOString().substring(0,10);

  useEffect(() => {
    if (taskToEdit) {
      setValue('title', taskToEdit.title || '');
      setValue('description', taskToEdit.description || '');
      setValue('assignedTo', taskToEdit.assignedTo?._id || taskToEdit.assignedTo || '');
      setValue('dueDate', taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().substring(0,10) : '');
    } else {
      reset();
    }
  }, [taskToEdit, setValue, reset]);

  const submit = async (data) => {
    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit._id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created');
      }
      reset();
      setTaskToEdit?.(null);
      onTaskAction();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const cancelEdit = () => { setTaskToEdit(null); reset(); };

  return (
    <form onSubmit={handleSubmit(submit)} className="relative flex flex-col gap-4 text-white max-w-xl" aria-label={taskToEdit ? 'Edit Task Form' : 'Create Task Form'}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Title" aria-required="true" {...register('title')} error={errors.title?.message} />
        <label className="flex flex-col gap-1 text-sm font-medium">
          <span className="text-base-fg/80">Assigned To</span>
          <select aria-required="true" className={`w-full px-3 py-2 rounded-md bg-slate-900/40 border border-white/10 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 outline-none text-sm ${errors.assignedTo && 'border-red-500 focus:ring-red-400'}`} {...register('assignedTo')}>
            <option value="">Select a user</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
          </select>
          {errors.assignedTo && <span role="alert" className="text-xs text-red-400">{errors.assignedTo.message}</span>}
        </label>
        <Input label="Due Date" type="date" min={todayStr} {...register('dueDate')} error={errors.dueDate?.message} />
        <Input as="textarea" label="Description" rows={4} className="resize-none" {...register('description')} error={errors.description?.message} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting} size="sm">{taskToEdit ? 'Update' : 'Create'} Task</Button>
        {taskToEdit && <Button type="button" onClick={cancelEdit} variant="outline" size="sm">Cancel</Button>}
      </div>
    </form>
  );
};

export default TaskForm;