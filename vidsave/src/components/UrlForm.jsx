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
        {/* One flex row at every width: with the controls reduced to bare icons
            there is nothing left to anchor to the edges, so they flow inline. */}
        <div className="glass flex items-center gap-1 rounded-full p-2 shadow-2xl shadow-black/40 transition focus-within:border-ink/25">
          <label htmlFor="video-url" className="sr-only">
            Public video URL
          </label>

          <Link2 className="pointer-events-none ml-3 h-5 w-5 shrink-0 text-faint" />

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
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-faint disabled:opacity-60"
          />

          {canPaste && !url && (
            <button
              type="button"
              onClick={handlePaste}
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
              className="shrink-0 rounded-full p-2 text-faint transition hover:text-ink"
            >
              <ClipboardPaste className="h-5 w-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-label={loading ? "Checking link" : "Fetch video"}
            title="Fetch video"
            className="mr-1 shrink-0 rounded-full p-2 text-ink transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
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
