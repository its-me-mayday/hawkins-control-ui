import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { ART } from "../assets/art";

type Outcome = "PLAYER" | "ENEMY" | "DRAW" | null;

type Props = {
  player: HawkinsSymbol | null;
  enemy: HawkinsSymbol | null;
  outcome: Outcome;
  narration: string | null | undefined;
  locked: boolean;
  thinking: boolean;
  progress: number;
};

export default function BattleDuel({
  player,
  enemy,
  outcome,
  narration,
  locked,
  thinking,
  progress,
}: Props) {
  const isPlayerWin = outcome === "PLAYER";
  const isEnemyWin = outcome === "ENEMY";
  const isDraw = outcome === "DRAW";

  const winnerSymbol: HawkinsSymbol | null =
    isPlayerWin && player
      ? player
      : isEnemyWin && enemy
      ? enemy
      : null;

  const winnerArt = winnerSymbol ? ART[winnerSymbol] : null;

  let centerLabel = "Awaiting clash";
  if (isPlayerWin) centerLabel = "You win the round";
  else if (isEnemyWin) centerLabel = "Enemy wins the round";
  else if (isDraw) centerLabel = "Neon standstill";

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-4 sm:px-4 sm:py-5 ${
        locked ? "ring-1 ring-rose-500/30" : ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-stretch gap-3 sm:gap-4">
          <SideChoice
            label="You"
            symbol={player}
            outcome={outcome}
            side="PLAYER"
          />

          <div className="flex flex-col items-center justify-center flex-1 gap-2 px-1 sm:px-2">
            <span className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-400">
              Round result
            </span>
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-4 py-1.5 shadow-[0_0_18px_rgba(15,23,42,0.9)]">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">
                  {centerLabel}
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-slate-700 bg-slate-900/90 flex items-center justify-center overflow-hidden shadow-[0_0_26px_rgba(15,23,42,0.9)]">
                  {winnerArt ? (
                    <img
                      src={winnerArt.win ?? winnerArt.src}
                      alt={winnerArt.alt}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : isDraw ? (
                    <span className="text-xl sm:text-2xl font-semibold text-slate-200">
                      =
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-400">
                      Waiting…
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SideChoice
            label="Enemy"
            symbol={enemy}
            outcome={outcome}
            side="ENEMY"
            thinking={thinking && !enemy && !!player}
            progress={progress}
          />
        </div>

        <div className="rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-2 min-h-[3rem]">
          <p className="text-xs sm:text-sm text-slate-300 leading-snug">
            {narration ||
              (outcome === "PLAYER" &&
                "Your play cuts through the flicker of Hawkins and pushes the dark back for one more round.") ||
              (outcome === "ENEMY" &&
                "The lights dip and the air chills as the Upside Down steals this round.") ||
              (outcome === "DRAW" &&
                "The board hums, but neither side breaks through the neon stalemate.") ||
              (!player && !enemy &&
                "Pick your symbol to let Hawkins decide if the kids or the monsters take control.") ||
              (player && !enemy &&
                "Your card is locked. The enemy is reading the currents from the other side.") ||
              "Hawkins holds its breath, waiting for the next move."}
          </p>
        </div>
      </div>
    </div>
  );
}

type SideChoiceProps = {
  label: "You" | "Enemy";
  symbol: HawkinsSymbol | null;
  outcome: Outcome;
  side: "PLAYER" | "ENEMY";
  thinking?: boolean;
  progress?: number;
};

function SideChoice({
  label,
  symbol,
  outcome,
  side,
  thinking = false,
  progress = 0,
}: SideChoiceProps) {
  const art = symbol ? ART[symbol] : null;

  let imageSrc: string | undefined = art?.src;
  if (art && symbol && outcome) {
    if (side === "PLAYER") {
      if (outcome === "PLAYER") imageSrc = art.win ?? art.src;
      else if (outcome === "ENEMY") imageSrc = art.lose ?? art.src;
    } else if (side === "ENEMY") {
      if (outcome === "ENEMY") imageSrc = art.win ?? art.src;
      else if (outcome === "PLAYER") imageSrc = art.lose ?? art.src;
    }
  }

  const hasSymbol = !!symbol;

  return (
    <div className="flex flex-col items-center gap-2 w-24 sm:w-28">
      <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-slate-700 bg-slate-900/80 flex items-center justify-center overflow-hidden">
        {hasSymbol && imageSrc ? (
          <img
            src={imageSrc}
            alt={art?.alt ?? ""}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <span className="text-[0.65rem] text-slate-500 text-center px-1">
            {label === "You" ? "Pick" : "Hidden"}
          </span>
        )}
      </div>
      <span className="text-[0.7rem] text-slate-300 min-h-[1.2rem] text-center">
        {hasSymbol ? symbol : ""}
      </span>

      {label === "Enemy" && (
        <div className="w-full min-h-[1.1rem]">
          {thinking && !symbol ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center gap-1 text-[0.65rem] text-slate-400">
                <span>Thinking</span>
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400/90" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, Math.round(progress * 100)))}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-[0.65rem] text-slate-500 text-center">
              {hasSymbol ? "Locked" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
