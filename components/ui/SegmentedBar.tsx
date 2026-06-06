type SegmentedBarProps = {
  percent: number;
  segments?: number;
  label?: string;
  showPercent?: boolean;
  uniformHeight?: boolean;
};

export function SegmentedBar({
  percent,
  segments = 10,
  label,
  showPercent = true,
  uniformHeight = false,
}: SegmentedBarProps) {
  const filled = Math.round((percent / 100) * segments);

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-2 flex items-baseline justify-between gap-4">
          {label ? (
            <span className="hud-label min-w-0 truncate capitalize">{label}</span>
          ) : (
            <span />
          )}
          {showPercent && (
            <span className="shrink-0 font-[family-name:var(--font-share-tech)] text-xs text-[var(--hud-cyan)]">
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className="flex w-full items-end gap-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`hud-segment min-w-0 flex-1 ${i < filled ? "hud-segment-filled" : ""}`}
            style={{ height: uniformHeight ? "18px" : `${14 + (i % 3) * 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}
