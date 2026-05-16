export default function LoadingSpinner() {
  return (
    <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
      Fetching available download options...
    </div>
  );
}
