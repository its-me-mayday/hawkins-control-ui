import React from "react";

type AreaVariant = "player" | "enemy" | "battle";
type AreaProps = {
  variant?: AreaVariant;
  title?: string;
  subtitle?: string;
  headerAlign?: "left" | "center" | "right";
  className?: string;
  children: React.ReactNode;
  accent?: string;
};

const VARIANT_ACCENT: Record<AreaVariant, string> = {
  player: "var(--hawkins-red)",
  enemy: "var(--hawkins-cyan)",
  battle: "var(--hawkins-magenta)",
};

export default function GameArea({
  variant = "player",
  title,
  subtitle,
  headerAlign = "center",
  className,
  children,
  accent,
}: AreaProps) {
  const accentValue = accent ?? VARIANT_ACCENT[variant];
  return (
    <section className={["hk-panel", className].filter(Boolean).join(" ")} style={{ ["--accent" as any]: accentValue }}>
      {(title || subtitle) && (
        <header
          className={[
            "p-3",
            "mb-4",
            headerAlign === "left" && "text-left",
            headerAlign === "center" && "text-center",
            headerAlign === "right" && "text-right",
          ].filter(Boolean).join(" ")}
        >
          {title && <h2 className="hk-title text-base text-(--accent)">{title}</h2>}
          {subtitle && <p className="mt-1 text-xs text-(--hawkins-muted) uppercase tracking-widest">{subtitle}</p>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
