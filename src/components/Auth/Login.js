import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Updated API URL to point to your Render production link
  const API_URL = process.env.REACT_APP_API_URL || 'https://medication-reminder-tracker.onrender.com/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches the "Invalid credentials" or other errors from the backend
        throw new Error(data.message || 'Login failed');
      }

      // 1. Success: Store the JWT token specifically from the 'token' key in your JSON response
      localStorage.setItem('token', data.token);
      
      console.log("Login Successful, Token stored.");
      
      // 2. Redirect to the Dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to manage your schedule"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00a6d6] outline-none transition-all shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00a6d6] outline-none transition-all shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#00a6d6] hover:bg-[#0095c2] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 ${
            loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
          }`}
        >
          {loading ? 'Verifying...' : 'Sign in'}
        </button>
      </form>

      <div className="text-center mt-8 text-sm text-gray-500 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#00a6d6] font-bold hover:underline ml-1">
          Register
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;