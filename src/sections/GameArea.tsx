import type { ReactNode } from "react";

type Props = {
  variant: "player" | "battle";
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

export default function GameArea({
  variant,
  title,
  subtitle,
  className,
  children,
}: Props) {
  const isPlayer = variant === "player";

  const accentRing = isPlayer
    ? "border-rose-500/40 shadow-[0_0_26px_rgba(248,113,113,0.55)]"
    : "border-sky-500/35 shadow-[0_0_18px_rgba(56,189,248,0.45)]";

  const padding = isPlayer
    ? "px-3 py-3 sm:px-4 sm:py-4"
    : "px-3 py-2 sm:px-3.5 sm:py-3";

  const width = isPlayer ? "" : "max-w-2xl mx-auto";

  return (
    <section
      className={`rounded-2xl border bg-slate-950/80 backdrop-blur-sm ${accentRing} ${padding} ${width} ${
        className ?? ""
      }`}
    >
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-semibold tracking-[0.22em] uppercase text-slate-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[0.7rem] sm:text-xs text-slate-400 tracking-[0.12em] uppercase">
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
          <span className={isPlayer ? "text-rose-300/90" : "text-sky-300/90"}>
            {isPlayer ? "Selection" : "Resolution"}
          </span>
          <span className="text-slate-600">·</span>
          <span>Hawkins Control</span>
        </div>
      </header>

      <div className="mt-1">{children}</div>
    </section>
  );
}
