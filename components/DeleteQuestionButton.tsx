"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteQuestionAction } from "@/app/actions/questions";

type DeleteQuestionButtonProps = {
  questionId: string;
};

export function DeleteQuestionButton({ questionId }: DeleteQuestionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this question permanently?")) return;

    startTransition(async () => {
      const result = await deleteQuestionAction(questionId);
      if (result.success) {
        router.push("/questions");
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="hud-btn hud-btn-danger"
    >
      {isPending ? "Purging..." : "Purge entry"}
    </button>
  );
}
