"use client";

import { useMemo, useState } from "react";
import { normalizeTopic } from "@/lib/validators";

const NEW_TOPIC_VALUE = "__new__";

type TopicSelectProps = {
  existingTopics: string[];
  defaultTopic?: string;
  initialTopic?: string;
};

export function TopicSelect({
  existingTopics,
  defaultTopic,
  initialTopic,
}: TopicSelectProps) {
  const topicOptions = useMemo(() => {
    const set = new Set(existingTopics);
    if (initialTopic) set.add(initialTopic);
    if (defaultTopic) set.add(defaultTopic);
    return Array.from(set).sort();
  }, [existingTopics, initialTopic, defaultTopic]);

  const startingTopic = initialTopic ?? defaultTopic ?? "";
  const startsAsNew =
    topicOptions.length === 0 ||
    (startingTopic !== "" && !topicOptions.includes(startingTopic));

  const [mode, setMode] = useState<"existing" | "new">(
    startsAsNew ? "new" : "existing"
  );
  const [selectedTopic, setSelectedTopic] = useState(
    startsAsNew ? "" : startingTopic
  );
  const [newTopic, setNewTopic] = useState(
    startsAsNew ? startingTopic : ""
  );

  function handleSelectChange(value: string) {
    if (value === NEW_TOPIC_VALUE) {
      setMode("new");
      setSelectedTopic("");
      return;
    }
    setMode("existing");
    setSelectedTopic(value);
    setNewTopic("");
  }

  if (topicOptions.length === 0) {
    return (
      <div>
        <label htmlFor="topic" className="hud-label mb-1.5 block">
          Topic <span className="text-[var(--hud-rose)]">*</span>
        </label>
        <input
          id="topic"
          name="topic"
          required
          minLength={2}
          defaultValue={startingTopic}
          className="hud-input"
          placeholder="e.g. arrays, trees, system design"
        />
        <p className="mt-1.5 text-[0.65rem] text-[var(--hud-cyan-dim)]">
          Required — this will be your first topic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor="topic-select" className="hud-label mb-1.5 block">
        Topic <span className="text-[var(--hud-rose)]">*</span>
      </label>

      <select
        id="topic-select"
        value={mode === "new" ? NEW_TOPIC_VALUE : selectedTopic}
        onChange={(event) => handleSelectChange(event.target.value)}
        className="hud-input"
        required={mode === "existing"}
      >
        <option value="" disabled>
          Select a topic
        </option>
        {topicOptions.map((topic) => (
          <option key={topic} value={topic}>
            {topic.replace(/-/g, " ")}
          </option>
        ))}
        <option value={NEW_TOPIC_VALUE}>+ Add new topic</option>
      </select>

      {mode === "new" ? (
        <input
          id="topic"
          name="topic"
          required
          minLength={2}
          value={newTopic}
          onChange={(event) => setNewTopic(event.target.value)}
          className="hud-input"
          placeholder="New topic name"
        />
      ) : (
        <input type="hidden" name="topic" value={selectedTopic} />
      )}

      <p className="text-[0.65rem] text-[var(--hud-cyan-dim)]">
        Required — pick an existing topic or add a new one.
      </p>
    </div>
  );
}

export function getTopicFromFormData(formData: FormData): string {
  const raw = String(formData.get("topic") ?? "").trim();
  return normalizeTopic(raw);
}
