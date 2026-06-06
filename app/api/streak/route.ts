import { errorResponse, successResponse } from "@/lib/api-response";
import { getStreakStats, recordDailyVisit } from "@/lib/streak";

export async function GET() {
  try {
    const streak = await getStreakStats();
    return successResponse(streak);
  } catch (error) {
    console.error("[GET /api/streak]", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch streak", 500);
  }
}

export async function POST() {
  try {
    const streak = await recordDailyVisit();
    return successResponse(streak, 201);
  } catch (error) {
    console.error("[POST /api/streak]", error);
    return errorResponse("INTERNAL_ERROR", "Failed to record visit", 500);
  }
}
