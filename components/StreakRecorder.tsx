"use client";

import { useTransition } from "react";
import { recordStreakAction } from "@/app/actions/questions";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { HudPanel } from "@/components/ui/HudPanel";

type StreakRecorderProps = {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string | null;
};

export function StreakRecorder({
  currentStreak,
  longestStreak,
  lastVisit,
}: StreakRecorderProps) {
  const [isPending, startTransition] = useTransition();

  function handleCheckIn() {
    startTransition(async () => {
      await recordStreakAction();
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = lastVisit === today;
  const streakPct =
    longestStreak > 0 ? Math.round((currentStreak / longestStreak) * 100) : 0;
  const filledSegments = Math.round((streakPct / 100) * 14);

  return (
    <HudPanel tab="Streak">
      <div className="flex flex-col gap-5 pt-1">
        <div className="flex justify-center">
          <CircularGauge
            value={currentStreak}
            max={Math.max(longestStreak, currentStreak, 1)}
            label="Current streak"
            sublabel={`Best: ${longestStreak} day${longestStreak === 1 ? "" : "s"}`}
            size={100}
            accent="green"
          />
        </div>

        <div>
          <p className="hud-label mb-2">Activity index</p>
          <div className="flex w-full gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`hud-segment min-w-0 flex-1 ${i < filledSegments ? "hud-segment-filled" : ""}`}
                style={{ height: "18px" }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckIn}
          disabled={isPending || checkedInToday}
          className="hud-btn hud-btn-primary w-full"
        >
          {checkedInToday
            ? "Checked in today"
            : isPending
              ? "Saving..."
              : "Log daily check-in"}
        </button>
      </div>
    </HudPanel>
  );
}
