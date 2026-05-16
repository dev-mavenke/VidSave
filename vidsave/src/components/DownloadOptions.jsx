import { Download } from "lucide-react";
import { getDownloadUrl } from "../services/api";

export default function DownloadOptions({ formats = [], originalUrl }) {
  if (!formats.length) {
    return (
      <p className="mt-4 text-sm text-slate-400">
        No downloadable public formats found.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {formats.slice(0, 6).map((format) => {
        const href = getDownloadUrl({
          url: originalUrl,
          formatId: format.format_id,
          title: "vidsave-video"
        });

        return (
          <a
            key={format.format_id}
            href={href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 hover:bg-slate-800"
          >
            <span>
              <strong>{format.quality || format.format_note || "Video"}</strong>
              <p className="text-xs text-slate-400">
                {format.ext?.toUpperCase() || "MP4"}
              </p>
            </span>

            <Download size={18} />
          </a>
        );
      })}
    </div>
  );
}
