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
  const playerWins = outcome === "PLAYER";
  const enemyWins = outcome === "ENEMY";
  const draw = outcome === "DRAW";

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-4 sm:px-4 sm:py-5 ${
        locked ? "ring-1 ring-rose-500/30" : ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-stretch gap-4 sm:gap-6">
          <DuelSide
            label="You"
            symbol={player}
            highlight={playerWins}
            faded={!!outcome && !playerWins && !draw}
            alignment="left"
          />

          <div className="flex flex-col items-center justify-center px-1 sm:px-2 min-w-[90px]">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1">
              Round
            </div>
            <div className="flex items-center justify-center rounded-full border border-rose-500/60 bg-slate-950/80 px-5 py-1.5 shadow-[0_0_18px_rgba(248,113,113,0.7)]">
              <span className="text-sm sm:text-base font-semibold tracking-[0.35em] uppercase">
                VS
              </span>
            </div>

            <div className="mt-2 text-[0.7rem] text-slate-300 text-center min-h-[1.4rem]">
              {draw && "Draw"}
              {playerWins && "You win this round"}
              {enemyWins && "You lose this round"}
              {!outcome && !player && !enemy && "Choose your card to begin"}
              {!outcome && player && !enemy && "Enemy is preparing a move"}
            </div>
          </div>

          <DuelSide
            label="Enemy"
            symbol={enemy}
            highlight={enemyWins}
            faded={!!outcome && !enemyWins && !draw}
            alignment="right"
            thinking={thinking && !enemy && !!player}
            progress={progress}
          />
        </div>

        <div className="rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-2 min-h-[3rem]">
          <p className="text-xs sm:text-sm text-slate-300 leading-snug">
            {narration ||
              (outcome === "PLAYER" &&
                "Your choice bends the Upside Down to your will.") ||
              (outcome === "ENEMY" &&
                "The shadows close in as the enemy strikes back.") ||
              (outcome === "DRAW" &&
                "Energy crackles in the air, but the balance holds.") ||
              (!player && !enemy &&
                "Pick your Stranger Things symbol and let the neon decide your fate.") ||
              (player && !enemy &&
                "You made your move. The enemy is reading the currents of the Upside Down.") ||
              "The neon hums while the next clash takes shape."}
          </p>
        </div>
      </div>
    </div>
  );
}

type DuelSideProps = {
  label: string;
  symbol: HawkinsSymbol | null;
  highlight: boolean;
  faded: boolean;
  alignment: "left" | "right";
  thinking?: boolean;
  progress?: number;
};

function DuelSide({
  label,
  symbol,
  highlight,
  faded,
  alignment,
  thinking = false,
  progress = 0,
}: DuelSideProps) {
  const art = symbol ? ART[symbol] : null;

  const containerHighlight = highlight
    ? "border-rose-500/80 shadow-[0_0_28px_rgba(248,113,113,0.9)]"
    : "border-slate-700";
  const containerFade = faded ? "opacity-40" : "";
  const justify =
    alignment === "left"
      ? "items-start text-left"
      : "items-end text-right";

  const displayLabel =
    symbol ??
    (label === "You"
      ? ("No card yet" as HawkinsSymbol | string)
      : ("Hidden" as HawkinsSymbol | string));

  return (
    <div
      className={`flex flex-1 flex-col ${justify} rounded-2xl border bg-slate-950/70 px-3 py-3 sm:px-4 sm:py-4 ${containerHighlight} ${containerFade}`}
    >
      <div className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-400">
        {label}
      </div>

      <div className="mt-1 mb-2 min-h-[1.7rem]">
        <div className="inline-flex flex-col items-start gap-0.5">
          <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.14em]">
            {displayLabel}
          </span>
          {highlight && (
            <span className="text-[0.65rem] text-rose-300/90 uppercase tracking-[0.18em]">
              Advantage
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        {art ? (
          <div className="relative w-full max-w-[130px] sm:max-w-[150px] md:max-w-[170px] aspect-[4/5] overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/80">
            <img
              src={art.src}
              alt={art.alt}
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>
        ) : (
          <div className="flex h-[150px] w-full max-w-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/60">
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-slate-300 text-center px-2">
              {label === "You" ? "Pick a card" : "Enemy will reveal"}
            </span>
          </div>
        )}
      </div>

      {label === "Enemy" && (
        <div className="mt-2 w-full min-h-6">
          {thinking && !symbol ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-end gap-2 text-[0.7rem] text-slate-400">
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
            <div className="text-[0.7rem] text-slate-500 text-right">
              {symbol ? "Move locked" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
