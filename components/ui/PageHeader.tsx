type PageHeaderProps = {
  title: string;
  subtitle?: React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, badge, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--hud-cyan-muted)] pb-5">
      <div>
        <div className="flex items-center gap-3">
          <span className="hud-dot" />
          {badge && <span className="hud-badge">{badge}</span>}
        </div>
        <h1 className="hud-title mt-2 text-2xl sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-[var(--hud-cyan-dim)]">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
