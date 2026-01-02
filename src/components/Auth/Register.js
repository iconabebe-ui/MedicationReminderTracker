import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Automatically detect timezone (e.g., "Africa/Kenya")
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://medication-reminder-tracker.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to login
        alert("Registration successful! Please log in.");
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join MedTracker to manage your health"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00a6d6] outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00a6d6] outline-none transition-all"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#00a6d6] hover:bg-[#0095c2] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <div className="text-center mt-6 text-sm text-gray-500 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-[#00a6d6] font-bold hover:underline">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;