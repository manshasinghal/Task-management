import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../components/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import UserList from '../components/UserList';
import Card from './ui/Card';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchTasks();
    if (user.role === 'admin' || user.role === 'manager') {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally { setLoadingTasks(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally { setLoadingUsers(false); }
  };

  const handleTaskAction = () => {
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
  };
  
  const handleUserAction = () => {
    fetchUsers();
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}

      {(user.role === 'admin' || user.role === 'manager') && (
        <Card className="relative overflow-hidden">
          <h3 className="text-xl font-semibold mb-4 text-white">{taskToEdit ? 'Edit Task' : 'Create Task'}</h3>
          <TaskForm 
            users={users} 
            onTaskAction={handleTaskAction}
            taskToEdit={taskToEdit}
            setTaskToEdit={setTaskToEdit}
          />
        </Card>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-100">Your Tasks</h3>
        </div>
        <TaskList tasks={tasks} loading={loadingTasks} onTaskAction={handleTaskAction} onEdit={handleEditTask} />
      </section>

      {user.role === 'admin' && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-indigo-100">User Management</h3>
          <UserList users={users} loading={loadingUsers} onUserAction={handleUserAction} />
        </section>
      )}
    </div>
  );
};

export default DashboardPage;