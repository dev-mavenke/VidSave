import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import UrlForm from "../components/UrlForm";
import SkeletonCard from "../components/SkeletonCard";
import VideoPreviewCard from "../components/VideoPreviewCard";
import FAQ from "../components/FAQ";
import { useToast } from "../hooks/useToast";
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
  const { toast } = useToast();

  async function handleFetch(url) {
    const normalizedUrl = normalizeUrl(url);

    setLoading(true);
    setVideo(null);

    try {
      const data = await getVideoInfo(normalizedUrl);

      setVideo({
        title: data.title || "Untitled media",
        thumbnail: data.thumbnail || "",
        duration: data.duration || null,
        formats: Array.isArray(data.formats) ? data.formats : [],
        originalUrl: normalizedUrl
      });

    } catch (err) {
      toast({
        variant: "error",
        title: "Couldn't fetch that link",
        description: getErrorMessage(err)
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative">
      <Hero />

      <section className="mx-auto max-w-5xl px-5">
        <UrlForm onSubmit={handleFetch} loading={loading} />

        <AnimatePresence mode="wait">
          {loading ? (
            <SkeletonCard key="skeleton" />
          ) : (
            video && (
              <VideoPreviewCard
                key="card"
                video={video}
                onDownload={(format) =>
                  toast({
                    variant: "success",
                    title: "Download started",
                    description: `${format.quality} · ${format.ext?.toUpperCase() || "media"}`
                  })
                }
              />
            )
          )}
        </AnimatePresence>
      </section>

      <FAQ />
    </main>
  );
}
