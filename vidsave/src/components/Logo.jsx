import { Birdhouse } from "lucide-react";

// The mark is the glyph itself - no plate, no fill behind it. `size` is passed
// through to lucide; the wordmark inherits font-size from the caller.
export default function Logo({ size = 30, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2.5 font-display font-bold tracking-tight ${className}`}
    >
      <Birdhouse size={size} strokeWidth={2} className="shrink-0" />
      VidSave
    </span>
  );
}
