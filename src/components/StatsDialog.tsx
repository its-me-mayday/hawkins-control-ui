import { useEffect, useRef } from "react";

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
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const played = wins + losses + draws;
  const playerWinRate = played ? Math.round((wins / played) * 100) : 0;
  const enemyWinRate = played ? Math.round((losses / played) * 100) : 0;

  return (
    <dialog
      ref={ref}
      className="rounded-2xl border border-[rgba(255,17,51,.35)] bg-[rgba(10,11,16,.92)]
                 backdrop:bg-black/60 p-0 w-[min(92vw,420px)]"
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="hk-title text-sm tracking-[.28em]">STATS</h3>
          <button onClick={onClose} className="hk-btn hk-btn--muted text-xs px-3 py-1.5">Close</button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="hk-card">
            <div className="uppercase tracking-widest text-(--hawkins-muted) text-[11px]">Rounds</div>
            <div className="mt-1 text-lg">{played}</div>
          </div>
          <div className="hk-card">
            <div className="uppercase tracking-widest text-(--hawkins-muted) text-[11px]">Draws</div>
            <div className="mt-1 text-lg">{draws}</div>
          </div>
        </div>

        <div className="hk-card space-y-2">
          <div className="uppercase tracking-widest text-[11px] text-(--hawkins-muted)">Player</div>
          <div className="flex items-baseline justify-between">
            <span className="text-emerald-400">Wins</span>
            <span className="text-sm">{wins}</span>
          </div>
          <div className="h-2 rounded bg-white/5 overflow-hidden">
            <div className="h-full bg-emerald-500/70" style={{ width: `${playerWinRate}%` }} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-rose-400">Losses</span>
            <span className="text-sm">{losses}</span>
          </div>
          <div className="text-xs text-(--hawkins-muted)">Win rate {playerWinRate}%</div>
        </div>

        <div className="hk-card space-y-2">
          <div className="uppercase tracking-widest text-[11px] text-(--hawkins-muted)">Enemy</div>
          <div className="flex items-baseline justify-between">
            <span className="text-emerald-400">Wins</span>
            <span className="text-sm">{losses}</span>
          </div>
          <div className="h-2 rounded bg-white/5 overflow-hidden">
            <div className="h-full bg-cyan-400/70" style={{ width: `${enemyWinRate}%` }} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-rose-400">Losses</span>
            <span className="text-sm">{wins}</span>
          </div>
          <div className="text-xs text-(--hawkins-muted)">Win rate {enemyWinRate}%</div>
        </div>

        <div className="hk-card grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <div className="uppercase tracking-widest text-[11px] text-(--hawkins-muted)">Match</div>
            <div className="mt-1">You {playerScore} — {enemyScore} Enemy</div>
          </div>
          <div className="text-right">
            <div className="uppercase tracking-widest text-[11px] text-(--hawkins-muted)">Leading</div>
            <div className="mt-1">
              {playerScore === enemyScore ? "Tie" : playerScore > enemyScore ? "You" : "Enemy"}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
