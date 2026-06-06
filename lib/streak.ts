import { db } from "@/lib/db";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function daysBetween(a: string, b: string): number {
  const diff = parseDate(a).getTime() - parseDate(b).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export async function getStreakStats() {
  const visits = await db.dailyVisit.findMany({
    orderBy: { date: "desc" },
  });

  if (visits.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastVisit: null };
  }

  const dates = visits.map((visit) => visit.date).sort();
  let longestStreak = 1;
  let running = 1;

  for (let i = 1; i < dates.length; i += 1) {
    if (daysBetween(dates[i], dates[i - 1]) === 1) {
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 1;
    }
  }

  const today = formatDate(new Date());
  const yesterday = formatDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  const sortedDesc = [...dates].reverse();
  const mostRecent = sortedDesc[0];

  let currentStreak = 0;
  if (mostRecent === today || mostRecent === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sortedDesc.length; i += 1) {
      if (daysBetween(sortedDesc[i - 1], sortedDesc[i]) === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastVisit: mostRecent,
  };
}

export async function recordDailyVisit() {
  const today = formatDate(new Date());

  await db.dailyVisit.upsert({
    where: { date: today },
    update: {},
    create: { date: today },
  });

  return getStreakStats();
}
