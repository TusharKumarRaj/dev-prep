import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteQuestionButton } from "@/components/DeleteQuestionButton";
import { QuestionForm } from "@/components/QuestionForm";
import { RevisionScheduler } from "@/components/RevisionScheduler";
import { ToggleSolvedButton } from "@/components/ToggleSolvedButton";
import { HudPanel } from "@/components/ui/HudPanel";
import { getDistinctDifficulties, getDistinctTopics, getQuestionById } from "@/lib/questions";

export const revalidate = 60;

type QuestionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const { db } = await import("@/lib/db");
  const questions = await db.question.findMany({
    select: { id: true },
    take: 10,
  });
  return questions.map((question) => ({ id: question.id }));
}

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const { id } = await params;
  const [question, existingTopics, existingDifficulties] = await Promise.all([
    getQuestionById(id),
    getDistinctTopics(),
    getDistinctDifficulties(),
  ]);

  if (!question) {
    notFound();
  }

  const diffBadge =
    question.difficulty === "easy"
      ? "hud-badge-easy"
      : question.difficulty === "hard"
        ? "hud-badge-hard"
        : "hud-badge-medium";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/questions" className="hud-link text-xs tracking-widest uppercase">
        ← Return to archive
      </Link>

      <header className="border-b border-[var(--hud-cyan-muted)] pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`hud-badge capitalize ${diffBadge}`}>
                {question.difficulty}
              </span>
              {question.solved && (
                <span className="hud-badge hud-badge-solved">Cleared</span>
              )}
            </div>
            <h1 className="hud-title mt-3 text-2xl">{question.title}</h1>
          </div>
          <ToggleSolvedButton questionId={question.id} solved={question.solved} />
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Meta label="Sector" value={question.topic.replace(/-/g, " ")} />
        <Meta label="Threat" value={question.difficulty} />
        <Meta
          label="Next review"
          value={
            question.nextReviewAt
              ? question.nextReviewAt.toLocaleDateString()
              : "Unscheduled"
          }
        />
      </div>

      {question.description && (
        <HudPanel tab="Intel">
          <p className="whitespace-pre-wrap pt-1 text-sm leading-relaxed text-[var(--hud-cyan-dim)]">
            {question.description}
          </p>
        </HudPanel>
      )}

      <RevisionScheduler questionId={question.id} />

      <section>
        <h2 className="hud-label mb-3">Modify entry</h2>
        <QuestionForm
          mode="edit"
          existingTopics={existingTopics}
          existingDifficulties={existingDifficulties}
          initialData={{
            id: question.id,
            title: question.title,
            description: question.description,
            topic: question.topic,
            difficulty: question.difficulty,
            solved: question.solved,
          }}
        />
      </section>

      <DeleteQuestionButton questionId={question.id} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-panel p-3">
      <p className="hud-label">{label}</p>
      <p className="mt-1.5 capitalize text-sm text-[#c8f4ff]">{value}</p>
    </div>
  );
}
