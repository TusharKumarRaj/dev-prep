import Link from "next/link";
import { ToggleSolvedButton } from "@/components/ToggleSolvedButton";

type QuestionCardProps = {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  solved: boolean;
  nextReviewAt: Date | null;
  index?: number;
};

const difficultyBadge: Record<string, string> = {
  easy: "hud-badge-easy",
  medium: "hud-badge-medium",
  hard: "hud-badge-hard",
};

export function QuestionCard({
  id,
  title,
  topic,
  difficulty,
  solved,
  nextReviewAt,
  index,
}: QuestionCardProps) {
  const diffClass = difficultyBadge[difficulty] ?? "hud-badge";
  const hasIndex = index !== undefined;

  return (
    <article className="hud-panel group p-4 transition hover:border-[var(--hud-cyan)] hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]">
      <div
        className="grid items-center gap-x-3 gap-y-2"
        style={{
          gridTemplateColumns: hasIndex ? "1.75rem 1fr auto" : "1fr auto",
        }}
      >
        {hasIndex && (
          <span
            className="flex h-7 w-7 items-center justify-center self-center border border-[var(--hud-cyan-muted)] text-[0.65rem] text-[var(--hud-cyan-dim)]"
            style={{ gridRow: "1 / 3" }}
          >
            {index + 1}
          </span>
        )}

        <Link
          href={`/questions/${id}`}
          className="min-w-0 truncate text-sm leading-snug text-[#c8f4ff] transition hover:text-[var(--hud-cyan)] hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
          style={{ gridColumn: hasIndex ? 2 : 1 }}
        >
          {title}
        </Link>

        <div
          className="self-center"
          style={{ gridColumn: hasIndex ? 3 : 2, gridRow: "1 / 3" }}
        >
          <ToggleSolvedButton questionId={id} solved={solved} />
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          style={{ gridColumn: hasIndex ? 2 : 1 }}
        >
          <span className="hud-badge capitalize">{topic.replace(/-/g, " ")}</span>
          <span className={`hud-badge capitalize ${diffClass}`}>{difficulty}</span>
          {solved && <span className="hud-badge hud-badge-solved">Cleared</span>}
          {nextReviewAt && (
            <span className="text-[0.6rem] tracking-wider text-[var(--hud-cyan-dim)] uppercase">
              Rev: {nextReviewAt.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
