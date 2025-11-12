import { useEffect, useRef } from "react";
import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { ART } from "../assets/art";

type Outcome = "PLAYER" | "ENEMY" | "DRAW" | null;

type Props = {
  player?: HawkinsSymbol | null;
  enemy?: HawkinsSymbol | null;
  outcome?: Outcome;
  locked?: boolean;
  thinking?: boolean;
  progress?: number;
  enemyRevealed?: boolean;
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
  portal = false,
  jitter = false,
}: {
  who: "PLAYER" | "ENEMY";
  symbol?: HawkinsSymbol | null;
  outcome?: Outcome;
  locked?: boolean;
  align?: "left" | "right";
  portal?: boolean;
  jitter?: boolean;
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
  const showWin  = locked && ((who === "PLAYER" && outcome === "PLAYER") || (who === "ENEMY" && outcome === "ENEMY"));
  const showLose = locked && ((who === "PLAYER" && outcome === "ENEMY")  || (who === "ENEMY" && outcome === "PLAYER"));
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
    symbol === "ELEVEN" ? "var(--accent-eleven)" :
    symbol === "DEMOGORGON" ? "var(--accent-demog)" :
    "var(--accent-lab)";

  return (
    <div className="flex justify-center">
      <div
        className={[
          "hk-card overflow-hidden w-full max-w-[160px] sm:max-w-[200px] lg:max-w-[220px]",
          anim,
          portal ? "hk-portal" : "",
          jitter ? "hk-crt-jitter" : "",
        ].join(" ")}
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
            {portal && <div className="hk-portal-bloom pointer-events-none absolute inset-0" />}
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

export default function BattleDuel({
  player,
  enemy,
  outcome = null,
  locked = false,
  thinking = false,
  progress = 0,
  enemyRevealed = false,
}: Props) {
  const lastRevealRef = useRef(0);
  const portal = enemyRevealed && Date.now() - lastRevealRef.current < 600;
  const jitter = portal;

  useEffect(() => {
    if (enemyRevealed) lastRevealRef.current = Date.now();
  }, [enemyRevealed]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
      <DuelCard who="PLAYER" symbol={player ?? null} outcome={outcome} locked={locked} align="left" />
      <div className="text-center opacity-80 text-[color:var(--hawkins-muted)] uppercase tracking-widest text-[10px] sm:text-xs">
        VS
      </div>
      <div className="flex justify-center">
        {thinking && !enemy ? (
          <ProgressCard label="Enemy thinking" progress={progress} />
        ) : (
          <DuelCard
            who="ENEMY"
            symbol={enemy ?? null}
            outcome={outcome}
            locked={locked}
            align="right"
            portal={portal}
            jitter={jitter}
          />
        )}
      </div>
    </div>
  );
}
