import React, { useState } from 'react';
import api from '../api';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';

const UserList = ({ users, onUserAction, loading }) => {
  const [editRole, setEditRole] = useState({ userId: null, role: '' });

  const handleUpdateRole = async (userId) => {
    try {
      await api.put(`/users/${userId}`, { role: editRole.role });
      setEditRole({ userId: null, role: '' });
      onUserAction();
    } catch (err) {
      console.error('Failed to update user role', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      onUserAction();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-md p-3">
            <Skeleton className="h-4 w-20 col-span-1" />
            <Skeleton className="h-4 w-32 col-span-1" />
            <Skeleton className="h-4 w-16 col-span-1" />
            <Skeleton className="h-8 w-full col-span-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        <thead className="bg-white/10 text-base-fg/80">
          <tr>
            <th className="py-2 px-4 font-medium">Name</th>
            <th className="py-2 px-4 font-medium">Email</th>
            <th className="py-2 px-4 font-medium">Role</th>
            <th className="py-2 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t border-white/10 hover:bg-white/5">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                {editRole.userId === user._id ? (
                  <select
                    value={editRole.role}
                    onChange={(e) => setEditRole({ ...editRole, role: e.target.value })}
                    className="bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs"
                  >
                    <option value="user">user</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  <Badge status={user.role === 'admin' ? 'completed' : user.role === 'manager' ? 'in-progress' : 'pending'}>{user.role}</Badge>
                )}
              </td>
              <td className="py-2 px-4 space-x-2 whitespace-nowrap">
                {editRole.userId === user._id ? (
                  <Button size="sm" onClick={() => handleUpdateRole(user._id)}>Save</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setEditRole({ userId: user._id, role: user.role })}>Edit</Button>
                )}
                <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;