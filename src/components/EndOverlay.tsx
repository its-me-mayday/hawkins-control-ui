type Props = {
  open: boolean;
  winnerText: string | null | undefined;
  onNewMatch: () => void;
};

export default function EndOverlay({ open, winnerText, onNewMatch }: Props) {
  if (!open) return null;

  const playerWon = winnerText?.toLowerCase().includes("you");
  const title = playerWon ? "Match Victory" : "Match Over";
  const tag = playerWon
    ? "Tonight, Hawkins was on your side."
    : "The board falls quiet, but Hawkins never sleeps.";
  const badgeText = playerWon ? "Hawkins Champion" : "Hawkins Survivor";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-50 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_0_60px_rgba(15,23,42,1)] px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center rounded-full border border-rose-500/70 bg-slate-950/90 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-rose-200 shadow-[0_0_26px_rgba(248,113,113,0.9)]">
            <span className="mr-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            {badgeText}
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold tracking-[0.24em] uppercase text-slate-50">
            {title}
          </h2>

          <p className="text-[0.75rem] sm:text-sm text-slate-300 leading-snug max-w-sm">
            {winnerText || "The neon hums softly as this Hawkins experiment comes to an end."}
          </p>

          <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.18em]">
            {tag}
          </p>

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
            <button
              type="button"
              onClick={onNewMatch}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-rose-500/80 bg-rose-600/90 px-6 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-50 shadow-[0_0_26px_rgba(248,113,113,0.9)] hover:bg-rose-500 hover:border-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start new match
            </button>
          </div>

          <div className="mt-2 text-[0.65rem] text-slate-500 leading-snug">
            <p>
              Tune the rounds, reshuffle your instincts and see if Hawkins tells a different story
              next time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
