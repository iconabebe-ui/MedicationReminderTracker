import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Automatically detect timezone (e.g., "Africa/Kenya")
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://medication-reminder-tracker.onrender.com/api';

  // Validation Logic
  const passwordCriteria = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "At least one number", met: /\d/.test(formData.password) },
    { label: "At least one special character (@$!%*?)", met: /[@$!%*?&]/.test(formData.password) },
  ];

  const isPasswordStrong = passwordCriteria.every(c => c.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isPasswordStrong) {
      setError("Please meet all password strength requirements.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
      subtitle="Join Med Tracker to manage your health"
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

        {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#00b274] outline-none text-sm transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Real-time Strength Checklist */}
            {formData.password.length > 0 && (
              <div className="mt-3 p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Password Strength:</p>
                {passwordCriteria.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-2 text-[11px] font-bold ${item.met ? 'text-[#00b274]' : 'text-gray-400'}`}>
                    {item.met ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-xl outline-none text-sm ${confirmPassword && formData.password !== confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
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