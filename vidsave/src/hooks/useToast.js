import { createContext, useContext } from "react";

// Kept separate from the provider component so this module exports no components
// and stays fast-refresh friendly.
export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }

  return context;
}
