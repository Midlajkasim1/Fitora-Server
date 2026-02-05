import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm" }: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0d1f17] border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm italic mb-8">{message}</p>

              <div className="flex w-full gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold uppercase italic text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  className="flex-1 py-4 rounded-xl bg-red-500 text-white font-black uppercase italic text-xs shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};