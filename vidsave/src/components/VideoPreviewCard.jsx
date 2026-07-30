import { motion } from "framer-motion";
import { Download, ExternalLink, FileVideo, ImageOff } from "lucide-react";
import { getDownloadUrl } from "../services/api";

function formatBytes(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) return null;

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / 1024 ** exponent;

  return `${size >= 10 || exponent === 0 ? Math.round(size) : size.toFixed(1)} ${units[exponent]}`;
}

function formatDuration(seconds) {
  const total = Math.round(Number(seconds));

  if (!Number.isFinite(total) || total <= 0) return null;

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (n) => String(n).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

export default function VideoPreviewCard({ video, onDownload }) {
  if (!video) return null;

  const duration = formatDuration(video.duration);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl shadow-2xl shadow-black/50"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-elevated">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-faint">
            <ImageOff className="h-9 w-9" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />

        {duration && (
          <span className="absolute right-3 top-3 rounded-lg bg-canvas/80 px-2 py-1 font-mono text-xs text-ink backdrop-blur">
            {duration}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Ready to download
          </p>

          <h2 className="mt-1.5 line-clamp-2 font-display text-xl font-bold leading-snug text-ink md:text-2xl">
            {video.title}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {video.formats.length > 0
              ? `${video.formats.length} format${video.formats.length === 1 ? "" : "s"} available`
              : "No formats available"}
          </p>

          <a
            href={video.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted transition hover:text-ink"
          >
            Source
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {video.formats.length > 0 ? (
          <ul className="grid gap-2">
            {video.formats.map((format, index) => {
              const size = formatBytes(format.filesize);

              return (
                <li key={format.format_id ?? index}>
                  <a
                    href={getDownloadUrl({
                      url: video.originalUrl,
                      formatId: format.format_id,
                      title: video.title
                    })}
                    onClick={() => onDownload?.(format)}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-surface/60 p-3 transition hover:border-ink/20 hover:bg-elevated"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-muted transition group-hover:bg-ink/10 group-hover:text-ink">
                      <FileVideo className="h-4.5 w-4.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm font-semibold text-ink">
                          {format.quality}
                        </strong>

                        {index === 0 && (
                          <span className="rounded-md border border-line px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                            Best
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-sm text-faint">
                        {format.ext?.toUpperCase() || "MEDIA"}
                        {size && ` · ${size}`}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-muted transition group-hover:text-ink">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl border border-line bg-surface/60 p-4 text-sm text-muted">
            No downloadable formats were found for this public link.
          </p>
        )}
      </div>
    </motion.article>
  );
}
