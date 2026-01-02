import React, { useState, useEffect } from 'react';
import { X, Trash2, Clock, Info, Package } from 'lucide-react';

const MedicationDetails = ({ medId, onClose, onDelete }) => {
  const [med, setMed] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'https://medication-reminder-tracker.onrender.com/api';

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/medications/${medId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMed(data);
    };
    if (medId) fetchDetails();
  }, [medId]);

  if (!med) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{med.name}</h2>
            <p className="text-blue-500 font-bold">{med.dosage}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-600"><Clock size={18} /><span className="text-sm">Frequency: <strong>{med.frequency}</strong></span></div>
          <div className="flex items-center gap-3 text-gray-600"><Package size={18} /><span className="text-sm">Stock: <strong>{med.stock} pills</strong></span></div>
          <div className="flex items-center gap-3 text-gray-600"><Info size={18} /><span className="text-sm">{med.instructions}</span></div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onDelete(med.id)} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={18} /> Delete
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold">Done</button>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;