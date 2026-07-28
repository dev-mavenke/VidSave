import { motion } from "framer-motion";
import { BadgeCheck, LockKeyhole, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, label: "Fast metadata check" },
  { icon: LockKeyhole, label: "No account access" },
  { icon: BadgeCheck, label: "Public links only" }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl px-5 pt-20 text-center md:pt-28"
    >
      <motion.p
        variants={item}
        className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-muted" />
        Works with YouTube, TikTok, Instagram &amp; X
      </motion.p>

      <motion.h1
        variants={item}
        className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Save public videos,{" "}
        <span className="text-muted">without the mess.</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg"
      >
        Paste a link and pick your quality. No sign-up, no account access, no
        bundled installers - just the file you asked for.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-sm"
      >
        {highlights.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-muted"
          >
            <Icon className="h-4 w-4 text-faint" />
            <span>{label}</span>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
