import { Link } from "react-router-dom";
import { Download } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#071016]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="rounded-xl bg-cyan-400 p-2 text-slate-950">
            <Download size={18} />
          </span>
          VidSave
        </Link>

        <div className="flex gap-5 text-sm text-slate-300">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
      </nav>
    </header>
  );
}
