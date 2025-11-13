type Props = {
  open: boolean;
  onClose: () => void;
  wins: number;
  losses: number;
  draws: number;
  playerScore: number;
  enemyScore: number;
  heroName?: string;
};

export default function StatsDialog({
  open,
  onClose,
  wins,
  losses,
  draws,
  playerScore,
  enemyScore,
  heroName,
}: Props) {
  if (!open) return null;

  const totalMatches = wins + losses + draws;
  const winRate =
    totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  const lossRate =
    totalMatches > 0 ? Math.round((losses / totalMatches) * 100) : 0;
  const drawRate =
    totalMatches > 0 ? Math.round((draws / totalMatches) * 100) : 0;

  const currentLead =
    playerScore > enemyScore
      ? "You are leading this match."
      : playerScore < enemyScore
      ? "The enemy is ahead this match."
      : "This match is balanced so far.";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_0_60px_rgba(15,23,42,1)] px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center rounded-full border border-rose-500/70 bg-slate-950/90 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-rose-200 shadow-[0_0_22px_rgba(248,113,113,0.8)]">
              Hawkins stats
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-[0.24em] uppercase text-slate-50">
              Match history
            </h2>
            {heroName && (
              <p className="text-[0.75rem] text-slate-300 leading-snug">
                Current run as{" "}
                <span className="font-semibold text-rose-200">
                  {heroName}
                </span>
                .
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:border-rose-400 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Wins" value={wins} accent="win" rate={winRate} />
            <StatCard label="Losses" value={losses} accent="loss" rate={lossRate} />
            <StatCard label="Draws" value={draws} accent="draw" rate={drawRate} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                  Current match score
                </span>
                <span className="text-xs text-slate-300">{currentLead}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                <span className="text-xs font-semibold text-slate-200">
                  {playerScore}
                </span>
                <span className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                  vs
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {enemyScore}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[0.75rem] sm:text-sm text-slate-300 leading-snug">
              Over {totalMatches} recorded rounds, you have won {wins}, lost {losses} and
              drawn {draws}. Hawkins remembers every clash, whether it was a clean victory
              or a desperate stand in the flicker of the neon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  accent: "win" | "loss" | "draw";
  rate: number;
};

function StatCard({ label, value, accent, rate }: StatCardProps) {
  const accentClasses =
    accent === "win"
      ? "border-emerald-500/70 bg-emerald-600/15 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
      : accent === "loss"
      ? "border-rose-500/70 bg-rose-600/15 text-rose-200 shadow-[0_0_16px_rgba(248,113,113,0.45)]"
      : "border-sky-500/60 bg-sky-600/10 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.45)]";

  return (
    <div
      className={`rounded-2xl border px-3 py-2.5 sm:px-3.5 sm:py-3 flex flex-col gap-1.5 ${accentClasses}`}
    >
      <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-200/80">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-semibold tabular-nums">
          {value}
        </span>
        <span className="text-[0.7rem] text-slate-100/80">({rate}%)</span>
      </div>
    </div>
  );
}
