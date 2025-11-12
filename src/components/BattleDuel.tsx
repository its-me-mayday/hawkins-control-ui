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
    <div className="hk-card w-full" style={{ maxWidth: "min(64vw, 220px)" }}>
      <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[color:var(--hawkins-muted)] mb-2">
        {label}
      </div>
      <div
        className="w-full grid place-items-center text-[color:var(--hawkins-muted)]/80"
        style={{ height: "clamp(120px, 38vw, 180px)" }}
      >
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
        <div
          className="hk-card w-full grid place-items-center text-[color:var(--hawkins-muted)]"
          style={{ maxWidth: "min(64vw, 220px)", height: "clamp(120px, 38vw, 180px)" }}
        >
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

  const enemyRevealFx = who === "ENEMY" && symbol ? "hk-portal hk-crt-jitter" : "";

  return (
    <div className="flex justify-center">
      <div
        className={["hk-card overflow-hidden w-full", anim, enemyRevealFx].join(" ")}
        style={{
          maxWidth: "min(64vw, 220px)",
          borderColor: `${accent}55`,
          boxShadow: `0 0 16px ${accent}33, inset 0 0 18px ${accent}1A`,
        }}
      >
        <div className="relative w-full overflow-hidden rounded-lg grid place-items-center">
          <div className="w-full relative" style={{ height: "clamp(120px, 38vw, 180px)" }}>
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

function CenterOutcome({
  outcome,
  narration,
}: {
  outcome: Outcome;
  narration?: string | null;
}) {
  const label =
    outcome === "PLAYER" ? "YOU WIN" : outcome === "ENEMY" ? "YOU LOSE" : outcome === "DRAW" ? "DRAW" : "VS";

  const color =
    outcome === "PLAYER"
      ? "#34d399" // emerald-400
      : outcome === "ENEMY"
      ? "#fb7185" // rose-400
      : outcome === "DRAW"
      ? "#38bdf8" // sky-400
      : "var(--hawkins-muted)";

  const glow =
    outcome === null
      ? "0 0 0 rgba(0,0,0,0)"
      : `0 0 6px ${color}, 0 0 14px ${color}88, 0 0 26px ${color}55`;

  return (
    <div className="grid place-items-center text-center px-2">
      <div
        className="uppercase tracking-[.28em] font-semibold"
        style={{
          fontSize: "clamp(16px, 4.8vw, 24px)",
          color,
          textShadow: glow,
          letterSpacing: ".28em",
        }}
      >
        {label}
      </div>
      <div className="mt-1 text-[12px] sm:text-[13px] text-(--hawkins-muted)">
        {narration ?? (outcome ? "" : "Make your move")}
      </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
      <DuelCard who="PLAYER" symbol={player ?? null} outcome={outcome} locked={locked} align="left" />

      <CenterOutcome outcome={outcome} narration={narration ?? null} />

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
