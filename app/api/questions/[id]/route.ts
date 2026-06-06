import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { parseQuestionInput } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const question = await db.question.findUnique({ where: { id } });

    if (!question) {
      return errorResponse("NOT_FOUND", "Question not found", 404);
    }

    return successResponse(question);
  } catch (error) {
    console.error("[GET /api/questions/[id]]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch question",
      500
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await db.question.findUnique({ where: { id } });

    if (!existing) {
      return errorResponse("NOT_FOUND", "Question not found", 404);
    }

    const body = await request.json();
    const parsed = parseQuestionInput(body);

    if (!parsed.ok) {
      return errorResponse("VALIDATION_ERROR", parsed.message, 400);
    }

    const { title, description, topic, difficulty, solved, nextReviewAt } =
      parsed.data;

    const question = await db.question.update({
      where: { id },
      data: {
        title,
        description,
        topic,
        difficulty,
        solved: solved ?? existing.solved,
        nextReviewAt:
          nextReviewAt === undefined
            ? existing.nextReviewAt
            : nextReviewAt
              ? new Date(nextReviewAt)
              : null,
      },
    });

    return successResponse(question);
  } catch (error) {
    console.error("[PUT /api/questions/[id]]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to update question",
      500
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await db.question.findUnique({ where: { id } });

    if (!existing) {
      return errorResponse("NOT_FOUND", "Question not found", 404);
    }

    const body = (await request.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.description === "string") {
      data.description = body.description.trim();
    }
    if (typeof body.topic === "string") data.topic = body.topic.trim();
    if (typeof body.difficulty === "string") {
      data.difficulty = body.difficulty.trim();
    }
    if (typeof body.solved === "boolean") data.solved = body.solved;
    if (body.nextReviewAt === null) data.nextReviewAt = null;
    if (typeof body.nextReviewAt === "string") {
      data.nextReviewAt = new Date(body.nextReviewAt);
    }

    if (Object.keys(data).length === 0) {
      return errorResponse(
        "VALIDATION_ERROR",
        "No valid fields provided for update",
        400
      );
    }

    const question = await db.question.update({
      where: { id },
      data,
    });

    return successResponse(question);
  } catch (error) {
    console.error("[PATCH /api/questions/[id]]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to patch question",
      500
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await db.question.findUnique({ where: { id } });

    if (!existing) {
      return errorResponse("NOT_FOUND", "Question not found", 404);
    }

    await db.question.delete({ where: { id } });

    return successResponse({ id, deleted: true });
  } catch (error) {
    console.error("[DELETE /api/questions/[id]]", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to delete question",
      500
    );
  }
}
