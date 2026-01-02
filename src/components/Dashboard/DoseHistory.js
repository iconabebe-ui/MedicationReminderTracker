import React, { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

const DoseHistory = ({ refreshTrigger, medications }) => {
  const [history, setHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  
  const API_URL = 'https://medication-reminder-tracker.onrender.com/api';

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/dose-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Sorting by date descending and taking the top 10
      const sortedLogs = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at)).slice(0, 10) 
        : [];
      setHistory(sortedLogs);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date().toDateString();
    return date.toDateString() === today ? 'Today' : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-6 mt-10 mb-10">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer group"
        onClick={() => setIsVisible(!isVisible)}
      >
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-gray-600 transition-colors text-left">
          <History size={14} /> Recent Activity
        </h3>
        <span className="text-gray-300">
          {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isVisible && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {history.length > 0 ? (
            history.map((log) => {
              // Match medication from the dashboard's list
              const med = medications.find(m => m.id === log.medication_id);
              
              // Case-insensitive status check
              const statusNormalized = log.status?.toLowerCase();
              const isTaken = statusNormalized === 'taken';
              const isSkipped = statusNormalized === 'skipped';

              return (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-colors ${
                    isTaken ? 'bg-white border-gray-100' : 'bg-red-50/30 border-red-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isTaken ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                    }`}>
                      {isTaken ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                        {med ? med.name : 'Unknown Medication'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {formatDate(log.taken_at)} • {formatTime(log.taken_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${
                    isTaken 
                      ? 'bg-green-100/50 text-green-700' 
                      : 'bg-red-100/50 text-red-700'
                  }`}>
                    {log.status} {/* Displays "Taken" or "Skipped" exactly as stored */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 p-10 rounded-[2rem] border-2 border-dashed border-gray-200 text-center">
              <Clock className="mx-auto text-gray-300 mb-2" size={24} />
              <p className="text-gray-400 text-xs italic">No activity logged yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoseHistory;