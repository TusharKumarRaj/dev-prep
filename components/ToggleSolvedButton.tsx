"use client";

import { useTransition } from "react";
import { toggleSolvedAction } from "@/app/actions/questions";

type ToggleSolvedButtonProps = {
  questionId: string;
  solved: boolean;
};

export function ToggleSolvedButton({
  questionId,
  solved,
}: ToggleSolvedButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleSolvedAction(questionId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`hud-btn hud-btn-sm shrink-0 ${solved ? "hud-badge-solved !border-[rgba(0,255,170,0.5)] !text-[var(--hud-green)]" : ""}`}
    >
      {isPending ? "..." : solved ? "Solved" : "Pending"}
    </button>
  );
}
