import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-primary-container/15 border-rose-700/50 shadow-rose-950/20'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-slate-100 border-slate-700/50 shadow-slate-950/20'
                : 'bg-pink-950/90 text-primary-container/40 border-pink-700/50 shadow-pink-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-baby-pink shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-electric-pink shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0 text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
