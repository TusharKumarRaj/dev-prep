import Link from "next/link";
import { HudPanel } from "@/components/ui/HudPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedBar } from "@/components/ui/SegmentedBar";
import { getTopicSummary } from "@/lib/questions";

export const revalidate = 120;

export default async function TopicsPage() {
  const topics = await getTopicSummary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sector Analysis"
        badge="Progress"
        subtitle="Track how you're doing across each interview topic."
        action={
          <Link href="/questions/new" className="hud-btn hud-btn-primary">
            + Add entry
          </Link>
        }
      />

      {topics.length === 0 ? (
        <div className="hud-empty">
          <p>No topics yet. Add a question with a topic to get started.</p>
          <Link href="/questions/new" className="hud-link mt-3 inline-block text-sm">
            Add your first question →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
          <HudPanel key={topic.topic} tab={topic.topic.replace(/-/g, " ")}>
            <div className="flex items-start justify-between pt-1">
              <div>
                <p
                  className="text-3xl font-[family-name:var(--font-orbitron)] font-bold text-[var(--hud-cyan)]"
                  style={{ textShadow: "0 0 16px rgba(0,229,255,0.3)" }}
                >
                  {topic.progress}%
                </p>
                <p className="mt-1 text-[0.65rem] text-[var(--hud-cyan-dim)]">
                  {topic.total === 0
                    ? "No questions yet"
                    : `${topic.solved} cleared · ${topic.unsolved} pending · ${topic.total} total`}
                </p>
              </div>
              <div className="flex items-end gap-[3px]">
                {Array.from({ length: 8 }).map((_, i) => {
                  const filled = i < Math.round((topic.progress / 100) * 8);
                  return (
                    <div
                      key={i}
                      className={`hud-segment ${filled ? "hud-segment-filled" : ""}`}
                      style={{ height: `${16 + i * 3}px` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <SegmentedBar percent={topic.progress} uniformHeight />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/questions/new?topic=${encodeURIComponent(topic.topic)}`}
                className="hud-btn hud-btn-primary hud-btn-sm"
              >
                + Add to topic
              </Link>
              {topic.total > 0 && (
                <Link
                  href={`/questions?topic=${encodeURIComponent(topic.topic)}`}
                  className="hud-btn hud-btn-sm"
                >
                  View questions
                </Link>
              )}
            </div>
          </HudPanel>
        ))}
        </div>
      )}
    </div>
  );
}
