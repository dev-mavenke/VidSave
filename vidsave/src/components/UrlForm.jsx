import { useState } from "react";
import { Link, Search } from "lucide-react";

function isProbablyUrl(value) {
  return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(value.trim());
}

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

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
    <div className="mx-auto mt-10 max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-slate-950/30 backdrop-blur md:flex-row"
      >
        <label className="relative min-h-14 flex-1">
          <span className="sr-only">Public video URL</span>
          <Link className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste a public video link"
            inputMode="url"
            autoComplete="url"
            disabled={loading}
            className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/80 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={18} />
          {loading ? "Checking..." : "Fetch"}
        </button>
      </form>

      {error && <p className="mt-3 px-2 text-sm text-red-200">{error}</p>}
    </div>
  );
}
