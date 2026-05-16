import { motion } from "framer-motion";
import { BadgeCheck, LockKeyhole, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, label: "Fast metadata check" },
  { icon: LockKeyhole, label: "No account access" },
  { icon: BadgeCheck, label: "Public links only" }
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 text-center md:pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl"
      >
        Save public videos with a clean, reliable workflow.
      </motion.h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
        VidSave helps you save public videos and reels from TikTok, Instagram,
        Twitter/X, and YouTube. No sign-up. No account access. Simple and clean.
      </p>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
        {highlights.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2"
          >
            <Icon className="h-4 w-4 text-cyan-300" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
