import Link from "next/link";
import { QuestionCard } from "@/components/QuestionCard";
import { StreakRecorder } from "@/components/StreakRecorder";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { HudPanel } from "@/components/ui/HudPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedBar } from "@/components/ui/SegmentedBar";
import { getDashboardStats, getQuestions } from "@/lib/questions";
import { getStreakStats } from "@/lib/streak";

export const dynamic = "force-dynamic";

function StatPanel({
  title,
  value,
  max,
  label,
  accent,
}: {
  title: string;
  value: number;
  max: number;
  label: string;
  accent: "cyan" | "green" | "amber" | "rose";
}) {
  return (
    <HudPanel tab={title} className="flex min-h-[200px] flex-col items-center justify-center pb-5 pt-8">
      <CircularGauge
        value={value}
        max={max}
        label={label}
        accent={accent}
        size={96}
      />
    </HudPanel>
  );
}

export default async function DashboardPage() {
  const [stats, streak, recentQuestions] = await Promise.all([
    getDashboardStats(),
    getStreakStats(),
    getQuestions(),
  ]);

  const recent = recentQuestions.slice(0, 5);
  const solveRate =
    stats.total === 0 ? 0 : Math.round((stats.solved / stats.total) * 100);
  const totalMax = Math.max(stats.total, 10);
  const countMax = Math.max(stats.total, 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Command Center"
        badge="Overview"
        subtitle="Your interview prep progress at a glance."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatPanel title="Total" value={stats.total} max={totalMax} label="Questions" accent="cyan" />
        <StatPanel title="Cleared" value={stats.solved} max={countMax} label="Solved" accent="green" />
        <StatPanel title="Pending" value={stats.unsolved} max={countMax} label="Unsolved" accent="amber" />
        <StatPanel title="Review" value={stats.dueForReview} max={countMax} label="Due now" accent="rose" />
      </section>

      <HudPanel tab="Progress index" className="pt-7">
        <SegmentedBar
            percent={solveRate}
            label="Overall clearance rate"
            uniformHeight
          />
          <p className="mt-2 text-xs text-[var(--hud-cyan-dim)]">
            {stats.solved} of {stats.total} questions cleared
          </p>
      </HudPanel>

      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <HudPanel
          tab="Recent entries"
          tabVariant="inline"
          headerAction={
            <Link href="/questions/new" className="hud-btn hud-btn-primary hud-btn-sm shrink-0">
              + Register
            </Link>
          }
        >
          {recent.length === 0 ? (
            <div className="hud-empty">
              <p>No questions saved yet.</p>
              <Link href="/questions/new" className="hud-link mt-3 inline-block text-sm">
                Register first entry →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((question, i) => (
                <li key={question.id}>
                  <QuestionCard {...question} index={i} />
                </li>
              ))}
            </ul>
          )}
        </HudPanel>

        <aside className="flex flex-col gap-4">
          <StreakRecorder
            currentStreak={streak.currentStreak}
            longestStreak={streak.longestStreak}
            lastVisit={streak.lastVisit}
          />

          <HudPanel
            tab="Sectors"
            headerAction={
              <Link href="/topics" className="hud-link text-[0.6rem] tracking-widest uppercase">
                All topics
              </Link>
            }
            tabVariant="inline"
          >
            <ul className="space-y-4 pt-1">
              {stats.topicStats.length === 0 ? (
                <li className="text-sm text-[var(--hud-cyan-dim)]">No topics yet</li>
              ) : (
                stats.topicStats.slice(0, 5).map((topic) => {
                  const pct =
                    topic.total === 0
                      ? 0
                      : Math.round((topic.solved / topic.total) * 100);
                  return (
                    <li key={topic.topic} className="space-y-1.5">
                      <SegmentedBar
                        percent={pct}
                        label={topic.topic.replace(/-/g, " ")}
                        uniformHeight
                      />
                      <p className="text-right text-[0.6rem] text-[var(--hud-cyan-dim)]">
                        {topic.solved}/{topic.total} cleared
                      </p>
                    </li>
                  );
                })
              )}
            </ul>
          </HudPanel>
        </aside>
      </section>
    </div>
  );
}
