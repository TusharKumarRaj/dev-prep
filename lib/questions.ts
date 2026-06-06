import { db } from "@/lib/db";

function buildTopicStats(
  rows: Array<{ topic: string; solved: boolean }>
) {
  const map = new Map<string, { total: number; solved: number }>();

  for (const row of rows) {
    const current = map.get(row.topic) ?? { total: 0, solved: 0 };
    current.total += 1;
    if (row.solved) current.solved += 1;
    map.set(row.topic, current);
  }

  return Array.from(map.entries()).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    solved: stats.solved,
    unsolved: stats.total - stats.solved,
  }));
}

export async function getDashboardStats() {
  const [total, solved, unsolved, dueForReview, topicRows] = await Promise.all([
    db.question.count(),
    db.question.count({ where: { solved: true } }),
    db.question.count({ where: { solved: false } }),
    db.question.count({
      where: {
        nextReviewAt: { lte: new Date() },
      },
    }),
    db.question.findMany({
      select: { topic: true, solved: true },
    }),
  ]);

  return {
    total,
    solved,
    unsolved,
    dueForReview,
    topicStats: buildTopicStats(topicRows),
  };
}

export async function getQuestions(filters?: {
  topic?: string;
  solved?: boolean;
}) {
  return db.question.findMany({
    where: {
      ...(filters?.topic ? { topic: filters.topic } : {}),
      ...(filters?.solved !== undefined ? { solved: filters.solved } : {}),
    },
    orderBy: [{ solved: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getQuestionById(id: string) {
  return db.question.findUnique({ where: { id } });
}

export async function getRevisionQueue() {
  const now = new Date();
  const upcoming = new Date();
  upcoming.setDate(upcoming.getDate() + 7);

  return db.question.findMany({
    where: {
      OR: [
        { nextReviewAt: { lte: now } },
        { nextReviewAt: null, solved: false },
      ],
    },
    orderBy: [{ nextReviewAt: "asc" }, { createdAt: "asc" }],
    take: 20,
  });
}

export async function getDistinctTopics() {
  const rows = await db.question.findMany({
    select: { topic: true },
    distinct: ["topic"],
    orderBy: { topic: "asc" },
  });
  return rows.map((row) => row.topic);
}

export async function getDistinctDifficulties() {
  const rows = await db.question.findMany({
    select: { difficulty: true },
    distinct: ["difficulty"],
    orderBy: { difficulty: "asc" },
  });
  return rows.map((row) => row.difficulty);
}

export async function getTopicSummary() {
  const rows = await db.question.findMany({
    select: { topic: true, solved: true },
  });

  return buildTopicStats(rows)
    .map((item) => ({
      ...item,
      progress:
        item.total === 0
          ? 0
          : Math.round((item.solved / item.total) * 100),
    }))
    .sort((a, b) => b.unsolved - a.unsolved);
}
