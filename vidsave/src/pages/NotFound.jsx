import { Link, useRouteError } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  const error = useRouteError();
  const status = error?.status ?? 404;
  const isMissing = status === 404;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-canvas">
        <Compass size={24} strokeWidth={2.2} />
      </span>

      <p className="mt-8 font-mono text-sm text-faint">{status}</p>

      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
        {isMissing ? "This page doesn't exist" : "Something went wrong"}
      </h1>

      <p className="mt-4 text-pretty leading-relaxed text-muted">
        {isMissing
          ? "The link you followed may be broken, or the page may have been moved."
          : "An unexpected error occurred while loading this page. Try again, or head back home."}
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to VidSave
      </Link>
    </main>
  );
}
