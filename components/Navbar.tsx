"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/questions", label: "Questions" },
  { href: "/topics", label: "Topics" },
  { href: "/revision", label: "Revision" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="relative border-b border-[var(--hud-cyan-muted)] bg-[rgba(0,8,13,0.92)] backdrop-blur-sm">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hud-cyan)] to-transparent opacity-60" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center border border-[var(--hud-cyan-muted)] bg-[rgba(0,229,255,0.06)]"
            style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
          >
            <span className="font-[family-name:var(--font-orbitron)] text-xs font-bold text-[var(--hud-cyan)] group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
              DP
            </span>
          </div>
          <div>
            <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.2em] text-[var(--hud-cyan)] uppercase">
              DevPrep
            </span>
            <span className="ml-1.5 font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.2em] text-[var(--hud-cyan-dim)] uppercase">
              AI
            </span>
            <p className="text-[0.55rem] tracking-[0.25em] text-[var(--hud-cyan-dim)] uppercase">
              Interview HUD v1.0
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hud-nav-link ${active ? "hud-nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
