import { motion } from "framer-motion";

const highlights = [
  "Fast metadata check",
  "No account access",
  "Public links only"
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
      className="mx-auto max-w-4xl px-5 pt-24 text-center md:pt-32"
    >
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
        className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-faint"
      >
        {highlights.map((label, index) => (
          <span key={label} className="inline-flex items-center gap-3">
            {index > 0 && (
              <span aria-hidden="true" className="text-muted/40">
                ·
              </span>
            )}
            {label}
          </span>
        ))}
      </motion.div>
    </motion.section>
  );
}
