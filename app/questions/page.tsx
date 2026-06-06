import Link from "next/link";
import { QuestionCard } from "@/components/QuestionCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDistinctTopics, getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

type QuestionsPageProps = {
  searchParams: Promise<{ topic?: string; solved?: string }>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const params = await searchParams;
  const topic = params.topic;
  const solved =
    params.solved === "true"
      ? true
      : params.solved === "false"
        ? false
        : undefined;

  const [questions, topics] = await Promise.all([
    getQuestions({ topic, solved }),
    getDistinctTopics(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Archive"
        badge="Browse"
        subtitle="Search and filter your saved coding questions by topic or status."
        action={
          <Link href="/questions/new" className="hud-btn hud-btn-primary">
            + New entry
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterLink href="/questions" active={!topic && solved === undefined}>
          All
        </FilterLink>
        <FilterLink
          href="/questions?solved=false"
          active={solved === false && !topic}
        >
          Pending
        </FilterLink>
        <FilterLink
          href="/questions?solved=true"
          active={solved === true && !topic}
        >
          Cleared
        </FilterLink>
        {topics.map((item) => (
          <FilterLink
            key={item}
            href={`/questions?topic=${encodeURIComponent(item)}`}
            active={topic === item}
          >
            {item.replace(/-/g, " ")}
          </FilterLink>
        ))}
      </div>

      {questions.length === 0 ? (
        <div className="hud-empty">No questions match this filter.</div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, i) => (
            <QuestionCard key={question.id} {...question} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`hud-btn hud-btn-sm capitalize ${active ? "hud-btn-active" : ""}`}
    >
      {children}
    </Link>
  );
}
