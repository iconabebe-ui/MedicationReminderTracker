import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xs animate-in slide-in-from-bottom duration-300">
      <div className="bg-gray-900 text-white px-5 py-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-1 rounded-full">
            <CheckCircle size={18} className="text-green-400" />
          </div>
          <span className="text-sm font-bold tracking-tight">{message}</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;