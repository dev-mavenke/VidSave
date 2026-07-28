import { motion } from "framer-motion";

/** Shared wrapper for the static content pages. */
export default function PageShell({ title, lede, children }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>

        {lede && (
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{lede}</p>
        )}

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted md:text-base [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_strong]:text-ink">
          {children}
        </div>
      </motion.div>
    </main>
  );
}
