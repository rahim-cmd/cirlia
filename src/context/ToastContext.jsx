/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const createToast = (toast) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  variant: toast.variant || "info",
  title: toast.title || "Notice",
  message: toast.message || "",
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = useCallback((toast) => {
    const nextToast = createToast(toast);
    setToasts((current) => [...current, nextToast]);
    window.setTimeout(() => removeToast(nextToast.id), toast.duration || 3500);
  }, []);

  const value = useMemo(() => ({
    success(message, title = "Success") {
      pushToast({ variant: "success", title, message });
    },
    error(message, title = "Error") {
      pushToast({ variant: "error", title, message });
    },
    info(message, title = "Info") {
      pushToast({ variant: "info", title, message });
    },
    warning(message, title = "Warning") {
      pushToast({ variant: "warning", title, message });
    },
  }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-[24px] border px-4 py-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] backdrop-blur ${
              toast.variant === "success"
                ? "border-[#b9d3bf] bg-[#f0f7f1] text-[#22412d]"
                : toast.variant === "error"
                ? "border-[#e7b9b0] bg-[#fff4f1] text-[#8f3e27]"
                : toast.variant === "warning"
                ? "border-[#ead8a8] bg-[#fff9eb] text-[#7b6031]"
                : "border-[#d8cfc3] bg-white/95 text-[#314131]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 opacity-90">{toast.message}</p>
              </div>
              <button type="button" onClick={() => removeToast(toast.id)} className="text-xs font-semibold uppercase tracking-[2px]">
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}