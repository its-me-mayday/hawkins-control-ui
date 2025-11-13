type Props = {
  open: boolean;
  onClose: () => void;
  wins: number;
  losses: number;
  draws: number;
  playerScore: number;
  enemyScore: number;
};

export default function StatsDialog({
  open,
  onClose,
  wins,
  losses,
  draws,
  playerScore,
  enemyScore,
}: Props) {
  if (!open) return null;

  const rounds = wins + losses + draws;
  const winRate = rounds ? Math.round((wins / rounds) * 100) : 0;
  const lossRate = rounds ? Math.round((losses / rounds) * 100) : 0;
  const drawRate = rounds ? Math.round((draws / rounds) * 100) : 0;

  const scoreDiff = playerScore - enemyScore;
  let momentum = "Hawkins hangs in a fragile balance of flashlights and fear.";
  if (scoreDiff > 2) {
    momentum = "You are running this match like the Party at the D&D table.";
  } else if (scoreDiff > 0) {
    momentum = "The kids would say the odds are leaning your way.";
  } else if (scoreDiff < -2) {
    momentum = "Right now it feels like the Demogorgon is calling the shots.";
  } else if (scoreDiff < 0) {
    momentum = "The enemy has a small lead, but Hawkins has seen comebacks before.";

  }

  const winBarWidth = Math.min(100, Math.max(0, winRate));
  const restBarWidth = 100 - winBarWidth;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <button
        type="button"
        aria-label="Close stats"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-100">
              Match Stats
            </h2>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
              Hawkins Control · Season 1
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:border-rose-500 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            ×
          </button>
        </div>

        <div className="px-4 pt-4 pb-4 sm:pb-5 space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5">
            <div className="flex flex-col">
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                Scoreboard
              </span>
              <span className="text-xs text-slate-300">
                Rounds played: {rounds || 0}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/60 bg-slate-950/90 px-3 py-1 shadow-[0_0_20px_rgba(248,113,113,0.65)]">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-300">
                You
              </span>
              <span className="text-sm font-semibold text-rose-300">
                {playerScore}
              </span>
              <span className="text-xs text-slate-500">:</span>
              <span className="text-sm font-semibold text-sky-300">
                {enemyScore}
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Enemy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <StatPill
              label="Wins"
              value={wins}
              accent="text-emerald-300 border-emerald-500/60"
              caption={`${winRate}% of rounds`}
            />
            <StatPill
              label="Losses"
              value={losses}
              accent="text-rose-300 border-rose-500/60"
              caption={`${lossRate}% of rounds`}
            />
            <StatPill
              label="Draws"
              value={draws}
              accent="text-sky-300 border-sky-500/60"
              caption={`${drawRate}% of rounds`}
            />
          </div>

          <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="uppercase tracking-[0.22em] text-slate-400">
                Win rate
              </span>
              <span className="font-medium">{winRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
              <div className="flex h-full w-full">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${winBarWidth}%` }}
                />
                <div
                  className="h-full bg-slate-700"
                  style={{ width: `${restBarWidth}%` }}
                />
              </div>
            </div>
            <p className="text-[0.7rem] leading-snug text-slate-400">
              {momentum}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <MiniCard
              label="Neon trend"
              value={
                scoreDiff > 0
                  ? "+ " + scoreDiff
                  : scoreDiff < 0
                  ? scoreDiff
                  : "Even"
              }
              hint={
                scoreDiff > 0
                  ? "Feels like the Party is one step ahead of the Demogorgon."
                  : scoreDiff < 0
                  ? "The enemy is nudging Hawkins toward the dark, but nothing is set in stone."
                  : "Like bikes in the night, both sides ride side by side."
              }
            />
            <MiniCard
              label="Round flavor"
              value={
                winRate >= 60
                  ? "On a hot streak"
                  : winRate <= 35
                  ? "Against the dark"
                  : "Balanced chaos"
              }
              hint={
                winRate >= 60
                  ? "Right now your plays look as sharp as Nancy with a plan."
                  : winRate <= 35
                  ? "More like wandering the woods with a flickering flashlight, but the story is not over."
                  : "This feels like a real Hawkins night: messy, tense and up for grabs."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type StatPillProps = {
  label: string;
  value: number;
  accent: string;
  caption: string;
};

function StatPill({ label, value, accent, caption }: StatPillProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 px-2.5 py-2">
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className={`mt-1 text-lg font-semibold ${accent}`}>
        {value}
      </span>
      <span className="mt-0.5 text-[0.65rem] text-slate-400">{caption}</span>
    </div>
  );
}

type MiniCardProps = {
  label: string;
  value: string | number;
  hint: string;
};

function MiniCard({ label, value, hint }: MiniCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 px-2.5 py-2.5">
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="mt-1 text-sm font-semibold text-slate-100">
        {value}
      </span>
      <span className="mt-0.5 text-[0.7rem] text-slate-400 leading-snug">
        {hint}
      </span>
    </div>
  );
}
