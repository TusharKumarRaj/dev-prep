# DevPrep AI

A developer interview preparation app built with **Next.js App Router**. Track coding questions, mark them solved/unsolved, monitor topic progress, plan revisions, and maintain a daily streak.

## Features

- Save coding questions with topic, difficulty, and notes
- Mark questions as solved or unsolved
- Topic-wise progress tracking
- Revision planner for due questions
- Daily streak check-in

## Next.js concepts covered

| Concept | Where |
|---------|-------|
| File-based routing | `/`, `/questions`, `/questions/[id]`, `/topics`, `/revision`, `/about` |
| Layouts | `app/layout.tsx` with shared navbar |
| SSR | Dashboard, questions list, revision planner (`force-dynamic`) |
| SSG | About page (`force-static`) |
| ISR | Question detail (`revalidate: 60`), topics (`revalidate: 120`) |
| API Routes | `/api/questions`, `/api/questions/[id]`, `/api/streak` |
| GET / POST / PUT / PATCH / DELETE | Question CRUD in API routes |
| Database | SQLite + Prisma ORM |
| Structured API responses | `{ success, data }` / `{ success, error }` |
| Error handling | Validation, 404, 500 responses |
| Server Actions | Toggle solved, schedule revision, streak, delete |

## API Routes vs Server Actions

- **API Routes** — create/edit questions via `POST` and `PUT` from the form. Returns JSON for any HTTP client.
- **Server Actions** — quick one-click UI mutations (toggle solved, schedule revision, check-in streak, delete) without writing fetch boilerplate.

## Getting started

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API examples

```bash
# List all questions
curl http://localhost:3000/api/questions

# Create a question
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d '{"title":"Reverse Linked List","topic":"arrays","difficulty":"medium"}'

# Patch solved status
curl -X PATCH http://localhost:3000/api/questions/QUESTION_ID \
  -H "Content-Type: application/json" \
  -d '{"solved":true}'

# Delete
curl -X DELETE http://localhost:3000/api/questions/QUESTION_ID
```

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
