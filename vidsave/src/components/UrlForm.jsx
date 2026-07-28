import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardPaste, Link2, Loader2, Search } from "lucide-react";

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "X / Twitter"];

function isProbablyUrl(value) {
  return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(value.trim());
}

// readText needs a secure context and isn't implemented everywhere, so the paste
// button only appears where it can actually work.
function clipboardIsReadable() {
  return (
    typeof navigator !== "undefined" &&
    Boolean(navigator.clipboard?.readText) &&
    window.isSecureContext
  );
}

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [canPaste] = useState(clipboardIsReadable);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();

      if (text.trim()) {
        setUrl(text.trim());
        setError("");
      }

    } catch {
      setError("Clipboard access was blocked. Paste the link manually.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextUrl = url.trim();

    if (!nextUrl) {
      setError("Paste a public video link first.");
      return;
    }

    if (!isProbablyUrl(nextUrl)) {
      setError("Enter a valid public video URL.");
      return;
    }

    setError("");
    onSubmit(nextUrl);
  }

  return (
    <div className="mx-auto mt-12 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="glass group relative flex flex-col gap-2 rounded-2xl p-2 shadow-2xl shadow-black/40 transition focus-within:border-ink/25 sm:flex-row sm:items-center sm:rounded-full sm:p-2">
          <div className="relative flex-1">
            <label htmlFor="video-url" className="sr-only">
              Public video URL
            </label>

            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />

            <input
              id="video-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="Paste a public video link…"
              inputMode="url"
              autoComplete="url"
              spellCheck="false"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-sm text-ink outline-none placeholder:text-faint disabled:opacity-60 sm:h-12 sm:rounded-full"
            />

            {canPaste && !url && (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink/25 hover:text-ink sm:inline-flex"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                Paste
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-sm font-semibold text-canvas transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Checking" : "Fetch"}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 text-center text-sm text-rose-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-sm text-faint">
        {PLATFORMS.map((platform, index) => (
          <span key={platform} className="inline-flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-muted/50">
                ·
              </span>
            )}
            {platform}
          </span>
        ))}
      </div>
    </div>
  );
}
