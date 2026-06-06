"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { recordDailyVisit } from "@/lib/streak";

function reviewDate(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function toggleSolvedAction(questionId: string) {
  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return { success: false as const, error: "Question not found" };
    }

    const solved = !question.solved;

    await db.question.update({
      where: { id: questionId },
      data: {
        solved,
        nextReviewAt: solved ? reviewDate(3) : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/questions");
    revalidatePath("/revision");
    revalidatePath("/topics");
    revalidatePath(`/questions/${questionId}`);

    return { success: true as const, solved };
  } catch (error) {
    console.error("[toggleSolvedAction]", error);
    return { success: false as const, error: "Failed to update question" };
  }
}

export async function scheduleRevisionAction(questionId: string, days: number) {
  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return { success: false as const, error: "Question not found" };
    }

    if (days < 1 || days > 30) {
      return {
        success: false as const,
        error: "Revision must be between 1 and 30 days",
      };
    }

    await db.question.update({
      where: { id: questionId },
      data: { nextReviewAt: reviewDate(days) },
    });

    revalidatePath("/revision");
    revalidatePath(`/questions/${questionId}`);

    return { success: true as const };
  } catch (error) {
    console.error("[scheduleRevisionAction]", error);
    return { success: false as const, error: "Failed to schedule revision" };
  }
}

export async function recordStreakAction() {
  try {
    const streak = await recordDailyVisit();
    revalidatePath("/");
    return { success: true as const, streak };
  } catch (error) {
    console.error("[recordStreakAction]", error);
    return { success: false as const, error: "Failed to record streak" };
  }
}

export async function deleteQuestionAction(questionId: string) {
  try {
    await db.question.delete({ where: { id: questionId } });
    revalidatePath("/");
    revalidatePath("/questions");
    revalidatePath("/topics");
    revalidatePath("/revision");
    return { success: true as const };
  } catch (error) {
    console.error("[deleteQuestionAction]", error);
    return { success: false as const, error: "Failed to delete question" };
  }
}
