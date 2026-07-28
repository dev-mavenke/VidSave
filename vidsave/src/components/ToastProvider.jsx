import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "../hooks/useToast";

let nextId = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 5000 }) => {
      const id = ++nextId;

      setToasts((current) => [...current, { id, title, description, variant }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));

      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
