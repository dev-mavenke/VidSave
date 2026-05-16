export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 px-5 py-8 text-center text-sm text-slate-400">
      &copy; {new Date().getFullYear()} VidSave. Public media downloader. No account access required.
    </footer>
  );
}
