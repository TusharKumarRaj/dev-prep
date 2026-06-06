import "dotenv/config";
import { createPrismaClient } from "../lib/prisma";

const db = createPrismaClient();

async function main() {
  await db.dailyVisit.deleteMany();
  await db.question.deleteMany();

  const questions = [
    {
      title: "Two Sum",
      description: "Use a hash map to find complements in O(n).",
      topic: "arrays",
      difficulty: "easy",
      solved: true,
    },
    {
      title: "Valid Parentheses",
      description: "Stack-based matching for brackets.",
      topic: "strings",
      difficulty: "easy",
      solved: false,
    },
    {
      title: "Binary Tree Level Order Traversal",
      description: "BFS with a queue.",
      topic: "trees",
      difficulty: "medium",
      solved: false,
    },
    {
      title: "Climbing Stairs",
      description: "Classic bottom-up DP.",
      topic: "dynamic-programming",
      difficulty: "easy",
      solved: true,
    },
    {
      title: "Design URL Shortener",
      description: "Hashing, collision handling, read/write ratio.",
      topic: "system-design",
      difficulty: "hard",
      solved: false,
    },
  ];

  for (const question of questions) {
    await db.question.create({
      data: {
        ...question,
        nextReviewAt: question.solved
          ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          : null,
      },
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  await db.dailyVisit.createMany({
    data: [{ date: yesterday }, { date: today }],
  });

  console.log("Seeded sample questions and streak data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
