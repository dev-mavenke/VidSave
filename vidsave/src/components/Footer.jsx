import { Link } from "react-router-dom";
import Logo from "./Logo";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" }
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo size={26} />

          <p className="mt-4 text-sm leading-relaxed text-muted">
            A simple way to save public videos from the platforms you already use.
            No accounts, no tracking, no bundled extras.
          </p>
        </div>

        <nav className="flex gap-6 text-sm text-muted">
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="transition hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-faint md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} VidSave</p>
          <p>
            For public content only. Respect copyright and each platform's terms
            of service.
          </p>
        </div>
      </div>
    </footer>
  );
}
