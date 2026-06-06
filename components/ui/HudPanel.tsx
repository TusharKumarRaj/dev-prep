import { ReactNode } from "react";

type HudPanelProps = {
  children: ReactNode;
  label?: string;
  className?: string;
  tab?: string;
  /** inline = tab sits in document flow (centered); absolute = tab floats on border */
  tabVariant?: "inline" | "absolute";
  headerAction?: ReactNode;
};

export function HudPanel({
  children,
  label,
  className = "",
  tab,
  tabVariant = "absolute",
  headerAction,
}: HudPanelProps) {
  const hasHeaderRow = tab && tabVariant === "inline";

  return (
    <div
      className={`hud-panel ${tabVariant === "absolute" ? "pt-6" : "pt-5"} p-5 ${className}`}
    >
      {tab && tabVariant === "absolute" && (
        <span className="hud-panel-tab">{tab}</span>
      )}

      {hasHeaderRow && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="hud-label shrink-0">{tab}</span>
          {headerAction}
        </div>
      )}

      {label && !tab && <p className="hud-label mb-3">{label}</p>}

      {children}
    </div>
  );
}
