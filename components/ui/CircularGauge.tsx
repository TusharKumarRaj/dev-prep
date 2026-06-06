type CircularGaugeProps = {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  size?: number;
  accent?: "cyan" | "green" | "amber" | "rose";
};

const accentColors = {
  cyan: { stroke: "#00e5ff", glow: "rgba(0,229,255,0.4)" },
  green: { stroke: "#00ffaa", glow: "rgba(0,255,170,0.4)" },
  amber: { stroke: "#ffb020", glow: "rgba(255,176,32,0.4)" },
  rose: { stroke: "#ff4466", glow: "rgba(255,68,102,0.4)" },
};

export function CircularGauge({
  value,
  max = 100,
  label,
  sublabel,
  size = 100,
  accent = "cyan",
}: CircularGaugeProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const color = accentColors[accent];
  const showRatio = max !== 100;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="hud-gauge-ring block -rotate-90"
          aria-hidden
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(0,229,255,0.1)"
            strokeWidth={4}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color.stroke}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            style={{ filter: `drop-shadow(0 0 4px ${color.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="flex items-baseline leading-none"
            style={{ color: color.stroke, textShadow: `0 0 12px ${color.glow}` }}
          >
            <span className="font-[family-name:var(--font-orbitron)] text-2xl font-bold">
              {value}
            </span>
            {showRatio && (
              <span className="ml-0.5 font-[family-name:var(--font-share-tech)] text-xs text-[var(--hud-cyan-dim)]">
                /{max}
              </span>
            )}
          </span>
        </div>
      </div>
      <p className="hud-label w-full text-center">{label}</p>
      {sublabel && (
        <p className="w-full text-center text-[0.6rem] text-[var(--hud-cyan-dim)]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
