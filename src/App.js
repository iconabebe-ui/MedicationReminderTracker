// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';



/**
 * ProtectedRoute Wrapper
 * Checks if a JWT token exists in localStorage.
 * If not, redirects the user to the Login page.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * PublicRoute Wrapper
 * If the user is already logged in, redirect them away from 
 * Auth pages (Login/Register) and straight to the Dashboard.
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes (Public) */}
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Application Routes (Protected) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Global Redirects */}
        {/* If user goes to "/", try to send them to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all for non-existent routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;