"use client";

import { useTransition } from "react";
import { scheduleRevisionAction } from "@/app/actions/questions";
import { HudPanel } from "@/components/ui/HudPanel";

type RevisionSchedulerProps = {
  questionId: string;
};

export function RevisionScheduler({ questionId }: RevisionSchedulerProps) {
  const [isPending, startTransition] = useTransition();

  function schedule(days: number) {
    startTransition(async () => {
      await scheduleRevisionAction(questionId, days);
    });
  }

  return (
    <HudPanel tab="Revision">
      <p className="pt-1 text-xs text-[var(--hud-cyan-dim)]">
        Pick when you want to review this question again.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 3, 7, 14].map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => schedule(days)}
            disabled={isPending}
            className="hud-btn hud-btn-sm"
          >
            +{days}d
          </button>
        ))}
      </div>
    </HudPanel>
  );
}
