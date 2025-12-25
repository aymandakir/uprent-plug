'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'match';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const TOAST_CONFIG: Record<ToastVariant, { icon: any; color: string; bgColor: string }> = {
  success: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  info: { icon: Info, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  match: { icon: Sparkles, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts((prev) => [...prev.slice(-2), newToast]); // Max 3 visible

    // Auto-dismiss
    if (newToast.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = TOAST_CONFIG[toast.variant];
  const Icon = config.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto"
    >
      <div
        className={cn(
          'rounded-lg border border-white/10 p-4 shadow-xl backdrop-blur-sm',
          config.bgColor
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.color)} />
          <div className="flex-1 min-w-0">
            <p className="text-body font-semibold text-white mb-1">{toast.title}</p>
            {toast.message && (
              <p className="text-body-sm text-white/70 line-clamp-2">{toast.message}</p>
            )}
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onRemove(toast.id);
                }}
                className="mt-2 text-body-sm text-electric-blue hover:text-electric-blue/80 font-medium"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>

        {/* Progress Bar */}
        {toast.duration && !isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
}

