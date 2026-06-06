import Link from "next/link";
import { QuestionCard } from "@/components/QuestionCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getRevisionQueue } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const queue = await getRevisionQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revision Queue"
        badge="Due today"
        subtitle="Questions to revisit — due for review or still unsolved."
      />

      {queue.length === 0 ? (
        <div className="hud-empty">
          <p>All sectors clear. No pending revisions.</p>
          <Link href="/questions/new" className="hud-link mt-3 inline-block text-sm">
            Register new entry →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((question, i) => (
            <QuestionCard key={question.id} {...question} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
