import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Hero from "../components/Hero";
import UrlForm from "../components/UrlForm";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoPreviewCard from "../components/VideoPreviewCard";
import FAQ from "../components/FAQ";
import { getVideoInfo } from "../services/api";

function normalizeUrl(value) {
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getErrorMessage(err) {
  if (err.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Could not fetch this public link."
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  async function handleFetch(url) {
    const normalizedUrl = normalizeUrl(url);

    setLoading(true);
    setError("");
    setVideo(null);

    try {
      const data = await getVideoInfo(normalizedUrl);

      setVideo({
        title: data.title || "Untitled media",
        thumbnail: data.thumbnail || "",
        formats: Array.isArray(data.formats) ? data.formats : [],
        originalUrl: normalizedUrl
      });

    } catch (err) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <Hero />

      <section className="mx-auto max-w-5xl px-5">
        <UrlForm onSubmit={handleFetch} loading={loading} />

        {loading && <LoadingSpinner />}

        {error && (
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-100 shadow-lg shadow-red-950/10">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
            <p>{error}</p>
          </div>
        )}

        <VideoPreviewCard video={video} />
      </section>

      <FAQ />
    </main>
  );
}
