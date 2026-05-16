import { Download, ExternalLink, FileVideo, ImageOff } from "lucide-react";
import { getDownloadUrl } from "../services/api";

function getFormatLabel(format) {
  if (format.height) {
    return `${format.height}p`;
  }

  const quality = format.quality || format.resolution || format.format_note;
  const resolutionMatch = quality?.match(/x(\d{3,4})$/);

  if (resolutionMatch) {
    return `${resolutionMatch[1]}p`;
  }

  if (!quality || quality === "p" || quality === "unknown") {
    return "Standard Quality";
  }

  return quality;
}

export default function VideoPreviewCard({ video }) {
  if (!video) return null;

  return (
    <article className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-slate-950/30">
      {video.thumbnail ? (
        <img src={video.thumbnail} alt="" className="h-72 w-full object-cover" />
      ) : (
        <div className="flex h-56 w-full items-center justify-center bg-slate-900 text-slate-500">
          <ImageOff className="h-10 w-10" />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Ready to download
            </p>

            <h2 className="mt-2 text-2xl font-bold leading-snug text-white">
              {video.title}
            </h2>
          </div>

          <a
            href={video.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
          >
            Source
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {video.formats?.length > 0 ? (
          <div className="mt-6 grid gap-3">
            {video.formats.map((format, index) => (
              <a
                key={format.format_id || format.url || index}
                href={getDownloadUrl({
                  url: video.originalUrl,
                  formatId: format.format_id,
                  title: video.title
                })}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-4 transition hover:border-cyan-300/40 hover:bg-slate-900"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <FileVideo className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <strong className="block truncate text-white">
                      {getFormatLabel(format)}
                    </strong>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {format.ext || "media"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-cyan-300">
                  <Download className="h-4 w-4" />
                  Download
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            No downloadable formats were found for this public link.
          </p>
        )}
      </div>
    </article>
  );
}
