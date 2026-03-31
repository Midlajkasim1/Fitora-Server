import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  children?: React.ReactNode;
  variant?: "danger" | "warning"; 
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  children,
  variant = "danger"
}: ConfirmModalProps) => {
  
  const isWarning = variant === "warning";
  const accentColor = isWarning ? "text-yellow-500" : "text-red-500";
  const bgColor = isWarning ? "bg-yellow-500/10" : "bg-red-500/10";
  const buttonBg = isWarning 
    ? "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:bg-yellow-600" 
    : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600";

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
              {/* ✅ Dynamic Icon and Color */}
              <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center ${accentColor} mb-6`}>
                {isWarning ? <Info size={32} /> : <AlertTriangle size={32} />}
              </div>

              <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">{title}</h3>
              {message && (
                <p className="text-gray-400 text-sm italic mb-6 leading-relaxed">{message}</p>
              )}

              {children}
              
              <div className="flex w-full gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold uppercase italic text-xs hover:bg-white/5 transition-all"
                >
                  {isWarning ? "Close" : "Cancel"}
                </button>
                <button
                  onClick={() => { 
                    if (!isWarning) onConfirm(); // Only trigger confirm logic if it's a real action
                    onClose(); 
                  }}
                  className={`flex-1 py-4 rounded-xl text-white font-black uppercase italic text-xs transition-all ${buttonBg}`}
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