"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { HudPanel } from "@/components/ui/HudPanel";

type QuestionFormProps = {
  mode?: "create" | "edit";
  defaultTopic?: string;
  existingTopics?: string[];
  existingDifficulties?: string[];
  initialData?: {
    id?: string;
    title: string;
    description?: string | null;
    topic: string;
    difficulty: string;
    solved?: boolean;
  };
};

export function QuestionForm({
  mode = "create",
  defaultTopic,
  existingTopics = [],
  existingDifficulties = [],
  initialData,
}: QuestionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      solved: formData.get("solved") === "on",
    };

    try {
      const url =
        mode === "edit" && initialData?.id
          ? `/api/questions/${initialData.id}`
          : "/api/questions";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message ?? "Failed to save question");
      }

      router.push(`/questions/${result.data.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <HudPanel tab={mode === "edit" ? "Edit entry" : "New entry"}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label htmlFor="title" className="hud-label mb-1.5 block">
            Identification
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={initialData?.title ?? ""}
            className="hud-input"
            placeholder="Two Sum"
          />
        </div>

        <div>
          <label htmlFor="description" className="hud-label mb-1.5 block">
            Notes / approach
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description ?? ""}
            className="hud-input resize-none"
            placeholder="Hash map approach, O(n) time..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="topic" className="hud-label mb-1.5 block">
              Topic
            </label>
            <input
              id="topic"
              name="topic"
              list="topic-suggestions"
              required
              defaultValue={initialData?.topic ?? defaultTopic ?? ""}
              className="hud-input"
              placeholder="e.g. arrays, trees, system design"
            />
            <datalist id="topic-suggestions">
              {existingTopics.map((topic) => (
                <option key={topic} value={topic} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="difficulty" className="hud-label mb-1.5 block">
              Difficulty
            </label>
            <input
              id="difficulty"
              name="difficulty"
              list="difficulty-suggestions"
              defaultValue={initialData?.difficulty ?? ""}
              className="hud-input"
              placeholder="e.g. easy, medium, hard"
            />
            <datalist id="difficulty-suggestions">
              {existingDifficulties.map((level) => (
                <option key={level} value={level} />
              ))}
            </datalist>
          </div>
        </div>

        {mode === "edit" && (
          <label className="flex items-center gap-2 text-sm text-[var(--hud-cyan-dim)]">
            <input
              type="checkbox"
              name="solved"
              defaultChecked={initialData?.solved ?? false}
              className="accent-[var(--hud-cyan)]"
            />
            <span className="hud-label !text-[0.6rem]">Mark as cleared</span>
          </label>
        )}

        {error && <p className="hud-error">{error}</p>}

        <button type="submit" disabled={loading} className="hud-btn hud-btn-primary">
          {loading
            ? "Saving..."
            : mode === "edit"
              ? "Update entry"
              : "Register question"}
        </button>
      </form>
    </HudPanel>
  );
}
