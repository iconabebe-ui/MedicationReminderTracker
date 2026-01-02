import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, AlertTriangle, Loader2 } from 'lucide-react';

const Notifications = ({ refreshTrigger }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = 'https://medication-reminder-tracker.onrender.com/api';

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      
      // Filter for unseen notifications and sort by newest first
      if (Array.isArray(data)) {
        const unseen = data
          .filter(n => !n.seen)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(unseen.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Fetch when dashboard refreshes
  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  // Auto-poll for new notifications every minute
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsSeen = async (id) => {
    const token = localStorage.getItem('token');
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await fetch(`${API_URL}/notifications/${id}/seen`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
    } catch (err) {
      console.error("Could not sync 'seen' status with server");
    }
  };

  return (
    <div className="relative px-6 mt-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform active:scale-95"
        >
          <Bell 
            size={20} 
            className={notifications.length > 0 ? "text-[#00a6d6] animate-bounce" : "text-gray-400"} 
          />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          )}
        </button>

        {notifications.length > 0 && (
          <p className="text-[10px] font-black text-[#00a6d6] uppercase tracking-[0.15em] animate-pulse">
            {notifications.length} Action Required
          </p>
        )}
      </div>

      {showDropdown && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
          
          <div className="absolute left-6 right-6 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reminders</span>
              <button onClick={() => setShowDropdown(false)} className="text-gray-400">
                <Check size={14} />
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b border-gray-50 last:border-0 flex items-start gap-3 hover:bg-blue-50/30 transition-colors">
                    <div className="mt-1 p-1.5 bg-orange-50 text-orange-500 rounded-lg">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-gray-800 leading-snug">{n.message}</p>
                      <p className="text-[9px] text-gray-400 mt-1 font-medium">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button 
                      onClick={() => markAsSeen(n.id)}
                      className="p-2 text-gray-300 hover:text-green-500 transition-colors"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <BellOff size={24} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-xs text-gray-400 italic">No pending notifications</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;