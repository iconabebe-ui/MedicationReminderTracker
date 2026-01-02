import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Sparkles, Loader2 } from 'lucide-react';

import MedicationItem from './MedicationItem';
import AdherenceChart from './AdherenceChart';
import AddMedication from './AddMedication';
import MedicationDetails from './MedicationDetails';
import DoseHistory from './DoseHistory';
import Notifications from './Notifications';
import Toast from './Toast';

const API_URL = 'https://medication-reminder-tracker.onrender.com/api';

const Dashboard = () => {
  const [medications, setMedications] = useState([]);
  const [adherence, setAdherence] = useState({ percent: 0, taken: 0, total: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const fetchAllData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    
    try {
      const [medRes, statsRes, globalRes, logRes] = await Promise.all([
        fetch(`${API_URL}/medications`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/adherence/medications`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/adherence`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/dose-logs`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const meds = await medRes.json();
      const stats = await statsRes.json();
      const globalData = await globalRes.json();
      const logs = await logRes.json();

      setAdherence({ 
        percent: globalData?.adherence_percent || 0, 
        taken: globalData?.taken || 0, 
        total: globalData?.total || 0 
      });

      if (Array.isArray(meds)) {
        const dailyDoses = [];
        meds.forEach(med => {
          const medStat = Array.isArray(stats) ? stats.find(s => s.medication_id === med.id) : null;
          const lastLog = Array.isArray(logs) ? logs
            .filter(l => l.medication_id === med.id && l.status?.toLowerCase() === 'taken')
            .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at))[0] : null;

          const times = med.reminder_times?.length > 0 ? med.reminder_times : ["As Needed"];
          
          times.forEach(time => {
            dailyDoses.push({ 
              ...med, 
              displayTime: time, 
              uniqueId: `${med.id}-${time}`,
              lastTaken: lastLog ? lastLog.taken_at : null,
              adherence_percent: medStat ? medStat.adherence_percent : 0 
            });
          });
        });
        setMedications(dailyDoses.sort((a, b) => a.displayTime.localeCompare(b.displayTime)));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { 
    fetchAllData(); 
  }, [refreshTrigger, fetchAllData]);

  const handleDoseAction = async (medId, status) => {
    const token = localStorage.getItem('token');
    // Ensure "Taken" or "Skipped" format
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    try {
      const response = await fetch(`${API_URL}/medications/${medId}/log`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: formattedStatus })
      });

      if (response.ok) {
        if (window.navigator?.vibrate) window.navigator.vibrate(50);
        setRefreshTrigger(prev => prev + 1);
        setToast(`${formattedStatus} successfully!`);
      } else {
        const errData = await response.json().catch(() => ({}));
        setToast(errData.error || "Failed to update dose.");
      }
    } catch (err) { setToast("Server error."); }
  };

  const handleRefill = async (medId) => {
    const token = localStorage.getItem('token');
    const med = medications.find(m => m.id === medId);
    if (!med) return;

    try {
      const response = await fetch(`${API_URL}/medications/${medId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ...med, stock: 30 })
      });

      if (response.ok) {
        setRefreshTrigger(prev => prev + 1);
        setToast("Stock refilled to 30!");
      }
    } catch (err) { setToast("Refill failed."); }
  };

  const handleDeleteMedication = async (id) => {
    if (!window.confirm("Delete this medication?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/medications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedMedId(null);
        setRefreshTrigger(prev => prev + 1);
        setToast("Medication deleted.");
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#00a6d6]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-left relative">
      <header className="bg-white px-6 pt-8 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black italic tracking-tight">MedTracker</h1>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="text-gray-400 p-2">
            <LogOut size={22} />
          </button>
        </div>
        <div className="bg-white border p-5 rounded-3xl flex items-center shadow-sm">
          <AdherenceChart percent={adherence.percent} />
          <div className="ml-5">
            <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Global Adherence</h2>
            <p className="text-xl font-bold">{adherence.taken}/{adherence.total} Doses</p>
          </div>
        </div>
      </header>

      <Notifications refreshTrigger={refreshTrigger} />

      <main className="px-6 mt-8">
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Today's Schedule</h3>
        <div className="space-y-4">
          {medications.map((med) => (
            <MedicationItem 
              key={med.uniqueId} 
              med={med} 
              onSelect={setSelectedMedId} 
              onAction={(status) => handleDoseAction(med.id, status)} 
              onRefill={handleRefill}
            />
          ))}
        </div>
      </main>

      <DoseHistory refreshTrigger={refreshTrigger} medications={medications} />

      <button 
        onClick={() => setIsAddModalOpen(true)} 
        className="fixed bottom-8 right-6 w-16 h-16 bg-[#00a6d6] text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-all"
      >
        <Plus size={32} />
      </button>
      
      <AddMedication isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={() => setRefreshTrigger(p => p+1)} />
      {selectedMedId && <MedicationDetails medId={selectedMedId} onClose={() => setSelectedMedId(null)} onDelete={handleDeleteMedication} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Dashboard;