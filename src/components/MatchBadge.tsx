type Props = {
  player: number;
  enemy: number;
  targetWins: number;
};

export default function MatchBadge({ player, enemy, targetWins }: Props) {
  const total = targetWins;
  const clampedPlayer = Math.min(player, total);
  const clampedEnemy = Math.min(enemy, total);
  const sum = clampedPlayer + clampedEnemy || 1;
  const playerRatio = (clampedPlayer / sum) * 100;
  const enemyRatio = (clampedEnemy / sum) * 100;

  let status = "Locked in a close duel.";
  if (player >= targetWins && player > enemy) status = "You claimed this match.";
  else if (enemy >= targetWins && enemy > player) status = "The enemy rules this match.";
  else if (player - enemy >= 2) status = "You are clearly in control.";
  else if (enemy - player >= 2) status = "The enemy is pressing the advantage.";

  return (
    <div className="inline-flex flex-col rounded-full border border-slate-800/90 bg-slate-950/80 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_0_18px_rgba(15,23,42,0.8)] min-w-[260px]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
            Match
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
            Race to {targetWins}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-rose-300 uppercase tracking-[0.18em]">You</span>
          <span className="text-slate-400"> {player}</span>
          <span className="text-slate-600">:</span>
          <span className="text-slate-400">{enemy} </span>
          <span className="text-sky-300 uppercase tracking-[0.18em]">Enemy</span>
        </div>
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
          <div className="flex h-full w-full">
            <div
              className="h-full bg-rose-500"
              style={{ width: `${playerRatio}%` }}
            />
            <div
              className="h-full bg-sky-500"
              style={{ width: `${enemyRatio}%` }}
            />
          </div>
        </div>
        <div className="text-[0.65rem] text-slate-400 leading-tight">
          {status}
        </div>
      </div>
    </div>
  );
}
