import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { parseQuestionInput } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const topic = searchParams.get("topic") ?? undefined;
    const solvedParam = searchParams.get("solved");

    const solved =
      solvedParam === "true"
        ? true
        : solvedParam === "false"
          ? false
          : undefined;

    const questions = await db.question.findMany({
      where: {
        ...(topic ? { topic } : {}),
        ...(solved !== undefined ? { solved } : {}),
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    return successResponse(questions);
  } catch (error) {
    console.error("[GET /api/questions]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch questions",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseQuestionInput(body);

    if (!parsed.ok) {
      return errorResponse("VALIDATION_ERROR", parsed.message, 400);
    }

    const { title, description, topic, difficulty, solved, nextReviewAt } =
      parsed.data;

    const question = await db.question.create({
      data: {
        title,
        description,
        topic,
        difficulty,
        solved: solved ?? false,
        nextReviewAt: nextReviewAt ? new Date(nextReviewAt) : null,
      },
    });

    return successResponse(question, 201);
  } catch (error) {
    console.error("[POST /api/questions]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to create question",
      500
    );
  }
}
