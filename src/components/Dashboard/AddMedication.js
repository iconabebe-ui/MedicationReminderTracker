import React, { useState } from 'react';
import { X, Plus, Trash2, Clock, Loader2 } from 'lucide-react';

const AddMedication = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    stock: 30,
    instructions: '',
    reminder_times: ['08:00'] 
  });
  const [loading, setLoading] = useState(false);

  // Updated to your Render production URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://medication-reminder-tracker.onrender.com/api';

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.reminder_times];
    newTimes[index] = value;
    setFormData({ ...formData, reminder_times: newTimes });
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, reminder_times: [...formData.reminder_times, '12:00'] });
  };

  const removeTimeSlot = (index) => {
    const newTimes = formData.reminder_times.filter((_, i) => i !== index);
    setFormData({ ...formData, reminder_times: newTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/medications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onRefresh(); 
        onClose();   
        // Reset form for next use
        setFormData({ 
          name: '', 
          dosage: '', 
          frequency: 'daily', 
          stock: 30, 
          instructions: '', 
          reminder_times: ['08:00'] 
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save medication");
      }
    } catch (err) {
      alert("Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">Add New Med</h2>
          <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Med Name</label>
              <input 
                required 
                placeholder="Aspirin" 
                value={formData.name}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] outline-none" 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Dosage</label>
              <input 
                required 
                placeholder="100mg" 
                value={formData.dosage}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] outline-none" 
                onChange={e => setFormData({...formData, dosage: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Frequency</label>
              <select 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] appearance-none outline-none"
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Stock Count</label>
              <input 
                type="number" 
                placeholder="30" 
                value={formData.stock}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] outline-none" 
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 flex justify-between">
              Reminders <span>(Schedule)</span>
            </label>
            <div className="space-y-2 mt-2">
              {formData.reminder_times.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock size={16} className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      type="time" 
                      value={time}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] outline-none" 
                      onChange={e => handleTimeChange(index, e.target.value)} 
                    />
                  </div>
                  {formData.reminder_times.length > 1 && (
                    <button type="button" onClick={() => removeTimeSlot(index)} className="p-4 text-red-400 hover:text-red-600">
                      <Trash2 size={20}/>
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addTimeSlot}
                className="w-full p-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} /> Add Another Time
              </button>
            </div>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Instructions</label>
            <textarea 
              placeholder="Take after food..." 
              value={formData.instructions}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a6d6] h-24 outline-none resize-none" 
              onChange={e => setFormData({...formData, instructions: e.target.value})} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full mt-8 bg-[#00a6d6] text-white font-black py-5 rounded-3xl shadow-lg shadow-blue-100 transition-all ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0095c2] active:scale-95'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Saving...
            </div>
          ) : 'Save Medication'}
        </button>
      </form>
    </div>
  );
};

export default AddMedication;