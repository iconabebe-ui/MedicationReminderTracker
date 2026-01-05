import React, { useState } from 'react';
import { Clock, Check, X, Loader2, RefreshCw } from 'lucide-react';

const MedicationItem = ({ med, onSelect, onAction, onRefill }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isLowStock = med.stock !== null && med.stock <= 5;

  const handleAction = async (e, status) => {
    e.stopPropagation();
    if (isProcessing) return;
    setIsProcessing(true);
    await onAction(status);
    setIsProcessing(false);
  };

  const handleRefillClick = (e) => {
    e.stopPropagation();
    onRefill(med.id);
  };
  
  return (
    <div className={`bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:border-blue-100 ${isProcessing ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onSelect(med.id)}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.lastTaken ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-[#00a6d6]'}`}>
          {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <Clock size={24} />}
        </div>
        
        <div className="text-left">
          <h4 className="font-bold text-gray-900 text-lg leading-tight">{med.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{med.displayTime}</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{med.dosage}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
               <div className={`w-1.5 h-1.5 rounded-full mr-2 ${med.adherence_percent > 80 ? 'bg-green-500' : 'bg-orange-400'}`}></div>
               <span className="text-[9px] font-black text-gray-500 uppercase">{med.adherence_percent}% Adherence</span>
            </div>

            {isLowStock && (
              <button 
                onClick={handleRefillClick}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white transition-colors group"
              >
                <span className="text-[9px] font-black text-red-500 uppercase group-hover:text-white mr-1">Low Stock: {med.stock}  refill</span>
                <RefreshCw size={10} className="text-red-400 group-hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 ml-4">
        <button 
          disabled={isProcessing}
          onClick={(e) => handleAction(e, 'Skipped')}
          className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>

        <button 
          disabled={isProcessing}
          onClick={(e) => handleAction(e, 'Taken')}
          className="p-3 rounded-2xl bg-[#00a6d6] text-white shadow-lg shadow-blue-100 hover:bg-[#0095c2] transition-colors"
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
};

export default MedicationItem;