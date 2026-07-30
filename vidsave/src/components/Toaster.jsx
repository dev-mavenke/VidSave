import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useToast } from "../hooks/useToast";

const VARIANTS = {
  info: { Icon: Info, tone: "text-muted" },
  success: { Icon: CheckCircle2, tone: "text-emerald-400" },
  error: { Icon: AlertCircle, tone: "text-rose-400" }
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map(({ id, title, description, variant }) => {
          const { Icon, tone } = VARIANTS[variant] ?? VARIANTS.info;

          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-2xl shadow-black/50"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{title}</p>
                {description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(id)}
                aria-label="Dismiss notification"
                className="-m-1 rounded-lg p-1 text-faint transition hover:bg-white/5 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
