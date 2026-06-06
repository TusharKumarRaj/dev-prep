import { HudPanel } from "@/components/ui/HudPanel";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="About DevPrep AI"
        badge="Guide"
        subtitle="A focused tracker for developer interview preparation."
      />

      <HudPanel tab="Mission">
        <p className="pt-1 text-sm leading-relaxed text-[var(--hud-cyan-dim)]">
          Save coding questions, mark them solved or unsolved, track progress by
          topic, plan revisions, and build a daily practice streak — all in one
          place.
        </p>
      </HudPanel>

      <HudPanel tab="Features">
        <h2 className="hud-label mb-4">What you can do</h2>
        <ul className="space-y-3 text-sm text-[var(--hud-cyan-dim)]">
          {[
            ["Save questions", "Add title, notes, topic, and difficulty for any problem"],
            ["Track progress", "Mark questions solved and see stats on your dashboard"],
            ["Filter by topic", "Browse questions by arrays, trees, DP, and more"],
            ["Plan revisions", "Schedule when to revisit a question again"],
            ["Daily streak", "Check in each day to keep your practice habit going"],
          ].map(([label, detail]) => (
            <li key={label} className="flex items-start gap-3">
              <span className="hud-dot mt-1.5" />
              <span>
                <strong className="text-[var(--hud-cyan)]">{label}</strong>
                {" — "}
                {detail}
              </span>
            </li>
          ))}
        </ul>
      </HudPanel>

      <HudPanel tab="Quick tips">
        <h2 className="hud-label mb-4">Getting started</h2>
        <div className="grid gap-4 pt-1 sm:grid-cols-2 text-sm">
          <div
            className="border border-[var(--hud-cyan-muted)] p-4"
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <p className="hud-label text-[var(--hud-cyan)]">Add questions</p>
            <p className="mt-2 text-[var(--hud-cyan-dim)]">
              Use Register on the dashboard or Questions page to save problems
              you want to practice.
            </p>
          </div>
          <div
            className="border border-[var(--hud-cyan-muted)] p-4"
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <p className="hud-label text-[var(--hud-cyan)]">Stay consistent</p>
            <p className="mt-2 text-[var(--hud-cyan-dim)]">
              Check in daily from the dashboard and use the revision queue to
              review questions at the right time.
            </p>
          </div>
        </div>
      </HudPanel>
    </div>
  );
}
