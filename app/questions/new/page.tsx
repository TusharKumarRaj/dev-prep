import Link from "next/link";
import { QuestionForm } from "@/components/QuestionForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDistinctDifficulties, getDistinctTopics } from "@/lib/questions";
import { normalizeTopic } from "@/lib/validators";

type NewQuestionPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function NewQuestionPage({
  searchParams,
}: NewQuestionPageProps) {
  const params = await searchParams;
  const topicParam = params.topic?.trim();
  const normalizedTopic = topicParam ? normalizeTopic(topicParam) : "";
  const defaultTopic = normalizedTopic.length >= 2 ? normalizedTopic : undefined;

  const [existingTopics, existingDifficulties] = await Promise.all([
    getDistinctTopics(),
    getDistinctDifficulties(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Register Question"
        badge="New entry"
        subtitle={
          defaultTopic
            ? `Adding a question to ${defaultTopic.replace(/-/g, " ")}.`
            : "Add a coding question with notes, topic, and difficulty."
        }
      />
      <Link
        href={defaultTopic ? `/topics` : "/questions"}
        className="hud-link text-xs tracking-widest uppercase"
      >
        ← {defaultTopic ? "Back to topics" : "Return to archive"}
      </Link>
      <QuestionForm
        mode="create"
        defaultTopic={defaultTopic}
        existingTopics={existingTopics}
        existingDifficulties={existingDifficulties}
      />
    </div>
  );
}
