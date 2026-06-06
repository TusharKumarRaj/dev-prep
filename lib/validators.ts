export function normalizeTopic(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function normalizeDifficulty(value: string): string {
  return value.trim().toLowerCase();
}

export function parseQuestionInput(body: unknown):
  | {
      ok: true;
      data: {
        title: string;
        description?: string;
        topic: string;
        difficulty: string;
        solved?: boolean;
        nextReviewAt?: string | null;
      };
    }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const topic = normalizeTopic(typeof input.topic === "string" ? input.topic : "");
  const difficulty = normalizeDifficulty(
    typeof input.difficulty === "string" && input.difficulty.trim()
      ? input.difficulty
      : "medium"
  );
  const description =
    typeof input.description === "string" ? input.description.trim() : undefined;
  const solved = typeof input.solved === "boolean" ? input.solved : undefined;
  const nextReviewAt =
    input.nextReviewAt === null
      ? null
      : typeof input.nextReviewAt === "string"
        ? input.nextReviewAt
        : undefined;

  if (!title) {
    return { ok: false, message: "Title is required" };
  }

  if (!topic || topic.length < 2) {
    return { ok: false, message: "Topic is required — select one or enter a new topic" };
  }

  if (!difficulty) {
    return { ok: false, message: "Difficulty is required" };
  }

  return {
    ok: true,
    data: { title, description, topic, difficulty, solved, nextReviewAt },
  };
}
