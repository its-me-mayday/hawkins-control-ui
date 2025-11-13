import { UI_ART } from "../assets/art";

type Result = "PLAYER" | "ENEMY" | "DRAW" | null;
type HeroId = "DUSTIN" | "HOPPER" | "MIKE";

type Props = {
  open: boolean;
  winnerText: string | null;
  result: Result;
  heroId?: HeroId;
  heroName?: string;
  onNewMatch: () => void;
};

export default function EndOverlay({
  open,
  winnerText,
  result,
  heroId,
  heroName,
  onNewMatch,
}: Props) {
  if (!open) return null;

  const isPlayerWin = result === "PLAYER";
  const isEnemyWin = result === "ENEMY";
  const isDraw = result === "DRAW";

  const art =
    isEnemyWin && UI_ART.HAWKINS_UPSIDE
      ? UI_ART.HAWKINS_UPSIDE
      : UI_ART.HAWKINS;

  const toneClass = isPlayerWin
    ? "border-emerald-500/80 shadow-[0_0_32px_rgba(16,185,129,0.85)]"
    : isEnemyWin
    ? "border-rose-500/80 shadow-[0_0_32px_rgba(248,113,113,0.9)]"
    : "border-sky-500/70 shadow-[0_0_28px_rgba(56,189,248,0.75)]";

  const badgeText = isPlayerWin
    ? "Hawkins holds"
    : isEnemyWin
    ? "Upside Down surge"
    : "Neon stalemate";

  const baseSubtitle =
    winnerText ||
    (isPlayerWin &&
      "For tonight, the kids and Hawkins keep the dark one step away.") ||
    (isEnemyWin &&
      "The Christmas lights flicker and twist as the Upside Down pulls harder.") ||
    (isDraw &&
      "The board stops just short of breaking. Hawkins breathes, but the dark is still there.") ||
    "The experiment ends, but Hawkins never really sleeps.";

  let heroLine = "";

  if (isPlayerWin && heroId && heroName) {
    if (heroId === "DUSTIN") {
      heroLine = ` ${heroName} holds the line with quick math, bad jokes, and perfectly timed plays.`;
    } else if (heroId === "HOPPER") {
      heroLine = ` ${heroName} grinds through the noise and keeps Hawkins standing on sheer stubborn will.`;
    } else if (heroId === "MIKE") {
      heroLine = ` ${heroName} keeps the party together long enough to flip the board in your favor.`;
    }
  } else if (isEnemyWin && heroId && heroName) {
    if (heroId === "DUSTIN") {
      heroLine = ` Even with ${heroName}'s plans, the board tilts toward the Upside Down tonight.`;
    } else if (heroId === "HOPPER") {
      heroLine = ` Not even ${heroName}'s temper and badge can fully keep the dark out this time.`;
    } else if (heroId === "MIKE") {
      heroLine = ` The party follows ${heroName}, but tonight Hawkins slips a little closer to the other side.`;
    }
  } else if (isDraw && heroName) {
    heroLine = ` ${heroName} buys you time, but the next match will decide which side the town wakes up on.`;
  }

  const subtitle = `${baseSubtitle}${heroLine}`;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className={`relative z-50 w-full max-w-lg rounded-3xl border bg-slate-950/95 ${toneClass} px-4 py-5 sm:px-6 sm:py-6`}
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-slate-300">
                Match complete
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-[0.24em] uppercase text-slate-50">
                {badgeText}
              </h2>
              <p className="text-[0.8rem] sm:text-sm text-slate-200 leading-snug max-w-md">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <img
                src={art.src}
                alt={art.alt}
                className={`h-full w-full object-cover ${
                  isEnemyWin ? "rotate-180" : ""
                }`}
                draggable={false}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[0.75rem] text-slate-400 leading-snug max-w-xs">
              Start another run to see if Hawkins stays safe, or if the Upside Down decides
              to tip the board next time.
            </p>
            <button
              type="button"
              onClick={onNewMatch}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-200/80 bg-slate-50/95 px-6 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              New match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
