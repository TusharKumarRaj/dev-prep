import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hud-panel p-12 text-center">
      <p className="hud-label">Error 404</p>
      <h1 className="hud-title mt-3 text-3xl">Signal lost</h1>
      <p className="mt-3 text-sm text-[var(--hud-cyan-dim)]">
        This page or question could not be found.
      </p>
      <Link href="/" className="hud-btn hud-btn-primary mt-6 inline-block">
        Return to command center
      </Link>
    </div>
  );
}
