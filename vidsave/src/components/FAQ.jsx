import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    q: "Which platforms are supported?",
    a: "Public videos and reels from YouTube, TikTok, Instagram, and Twitter/X. Links from anywhere else are rejected before anything is fetched."
  },
  {
    q: "Do I need an account?",
    a: "No. VidSave never asks you to sign in, and it has no access to your accounts on any platform. It only reads what is already publicly visible."
  },
  {
    q: "Can I download private or age-restricted videos?",
    a: "No. Anything behind a login, an age gate, or a regional block will fail with a clear message. VidSave does not bypass access controls."
  },
  {
    q: "Where do the files go?",
    a: "Straight to your browser's download folder. The video is streamed through the server and never stored on it."
  }
];

function Item({ q, a, isOpen, onToggle, id }) {
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${id}`}
          id={`faq-trigger-${id}`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-muted"
        >
          <span className="text-sm font-semibold text-ink md:text-base">{q}</span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-faint transition-transform duration-300 ${
              isOpen ? "rotate-180 text-ink" : ""
            }`}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${id}`}
            role="region"
            aria-labelledby={`faq-trigger-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-sm leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto mt-24 max-w-2xl px-5 pb-24">
      <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        Questions
      </h2>

      <div className="mt-6">
        {QUESTIONS.map((entry, index) => (
          <Item
            key={entry.q}
            id={index}
            q={entry.q}
            a={entry.a}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
