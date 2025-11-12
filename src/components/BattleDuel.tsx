import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { ART } from "../assets/art";

type Outcome = "PLAYER" | "ENEMY" | "DRAW" | null;

type Props = {
  player?: HawkinsSymbol | null;
  enemy?: HawkinsSymbol | null;
  outcome?: Outcome;
  narration?: string | null;
  locked?: boolean;
  thinking?: boolean;
  progress?: number;
};

function ProgressCard({ label, progress = 0 }: { label: string; progress?: number }) {
  return (
    <div className="hk-card w-full max-w-[160px] sm:max-w-[200px] lg:max-w-[220px]">
      <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[color:var(--hawkins-muted)] mb-2">
        {label}
      </div>
      <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-full grid place-items-center text-[color:var(--hawkins-muted)]/80">
        Thinking…
      </div>
      <div className="mt-2">
        <div className="h-2 rounded bg-white/10 overflow-hidden">
          <div
            className="h-full rounded bg-[color:var(--hawkins-cyan)] transition-[width] duration-100"
            style={{ width: `${Math.max(0, Math.min(100, progress ?? 0))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DuelCard({
  who,
  symbol,
  outcome,
  locked,
  align = "left",
}: {
  who: "PLAYER" | "ENEMY";
  symbol?: HawkinsSymbol | null;
  outcome?: Outcome;
  locked?: boolean;
  align?: "left" | "right";
}) {
  if (!symbol) {
    return (
      <div className="flex justify-center">
        <div className="hk-card w-full max-w-[160px] sm:max-w-[200px] lg:max-w-[220px] grid place-items-center text-[color:var(--hawkins-muted)]">
          {who === "PLAYER" ? "Pick a card" : "Waiting..."}
        </div>
      </div>
    );
  }

  const art = ART[symbol];
  const showWin =
    locked && ((who === "PLAYER" && outcome === "PLAYER") || (who === "ENEMY" && outcome === "ENEMY"));
  const showLose =
    locked && ((who === "PLAYER" && outcome === "ENEMY") || (who === "ENEMY" && outcome === "PLAYER"));
  const src = showWin && art.win ? art.win : showLose && art.lose ? art.lose : art.src;

  const anim =
    locked && outcome === "PLAYER" && who === "PLAYER"
      ? "animate-card-win"
      : locked && outcome === "ENEMY" && who === "PLAYER"
      ? "animate-card-lose"
      : locked && outcome === "DRAW"
      ? "animate-card-draw"
      : "";

  const accent =
    symbol === "ELEVEN" ? "var(--accent-eleven)" : symbol === "DEMOGORGON" ? "var(--accent-demog)" : "var(--accent-lab)";

  return (
    <div className="flex justify-center">
      <div
        className={["hk-card overflow-hidden w-full max-w-[160px] sm:max-w-[200px] lg:max-w-[220px]", anim].join(" ")}
        style={{
          borderColor: `${accent}55`,
          boxShadow: `0 0 16px ${accent}33, inset 0 0 18px ${accent}1A`,
        }}
      >
        <div className="relative w-full overflow-hidden rounded-lg grid place-items-center">
          <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-full relative">
            <img
              src={src}
              alt={art.alt}
              loading="lazy"
              className={[
                "h-full w-full",
                "object-contain",
                showLose ? "saturate-[.85]" : "",
                align === "right" ? "scale-x-[-1]" : "",
              ].join(" ")}
              style={{ objectPosition: art.pos ?? "center" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12),transparent_30%,transparent_70%,rgba(0,0,0,.18))]" />
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 24px rgba(0,0,0,.25)" }} />
          </div>
        </div>

        <div className="mt-2 text-center uppercase tracking-widest">
          <span className="text-[11px] sm:text-xs" style={{ color: accent }}>
            {symbol.replaceAll("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  let text = "VS";
  let tone = "text-[color:var(--hawkins-muted)]";
  let glow: string | undefined;
  let anim = "";

  if (outcome === "PLAYER") {
    text = "YOU WIN";
    tone = "text-emerald-400";
    glow = "0 0 10px rgba(16,185,129,.65), 0 0 22px rgba(16,185,129,.35)";
    anim = "animate-hk-win";
  } else if (outcome === "ENEMY") {
    text = "YOU LOSE";
    tone = "text-rose-400";
    glow = "0 0 10px rgba(244,63,94,.65), 0 0 22px rgba(244,63,94,.35)";
    anim = "animate-hk-lose";
  } else if (outcome === "DRAW") {
    text = "DRAW";
    tone = "text-sky-400";
    glow = "0 0 10px rgba(56,189,248,.65), 0 0 22px rgba(56,189,248,.35)";
    anim = "animate-hk-draw";
  }

  return (
    <div
      className={[
        "text-center uppercase tracking-widest",
        "text-[11px] sm:text-xs md:text-sm",
        "px-2 py-1 rounded",
        tone,
        anim,
      ].join(" ")}
      style={{ textShadow: glow }}
    >
      {text}
    </div>
  );
}

export default function BattleDuel({
  player,
  enemy,
  outcome = null,
  narration = null,
  locked = false,
  thinking = false,
  progress = 0,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-5">
      <DuelCard who="PLAYER" symbol={player ?? null} outcome={outcome} locked={locked} align="left" />

      <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
        <OutcomeBadge outcome={outcome} />
        {narration ? (
          <p className="text-[11px] sm:text-xs text-[color:var(--hawkins-ink)]/90 max-w-[22ch]">
            {narration}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center">
        {thinking && !enemy ? (
          <ProgressCard label="Enemy thinking" progress={progress} />
        ) : (
          <DuelCard who="ENEMY" symbol={enemy ?? null} outcome={outcome} locked={locked} align="right" />
        )}
      </div>
    </div>
  );
}
