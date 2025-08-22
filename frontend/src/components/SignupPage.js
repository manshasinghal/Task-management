import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response.data.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen text-black w-full bg-gradient-to-br from-violet-900 via-indigo-800 to-slate-900 relative overflow-hidden flex flex-col items-center font-poppins px-4 sm:px-6 lg:px-8 py-10">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        
        {/* CORRECTED: The `password` input uses the correct state and handler */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
         <div>
                <label className="block text-sm font-medium mb-1">Select Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        <button
          type="submit"
          className="p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Sign Up
        </button>
        
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500">Log In</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;