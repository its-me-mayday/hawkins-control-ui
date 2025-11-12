type BattleViewProps = {
    narration?: string | null;
    result?: "PLAYER" | "ENEMY" | "DRAW" | null;
  };
  export default function BattleView({ narration, result }: BattleViewProps) {
    return (
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-widest">
          {result === "PLAYER" && <span className="text-emerald-400">YOU WIN</span>}
          {result === "ENEMY" && <span className="text-rose-400">YOU LOSE</span>}
          {result === "DRAW" && <span className="text-sky-400">DRAW</span>}
          {!result && <span className="text-(--hawkins-muted)">No clash yet</span>}
        </div>
        <p className="text-sm text-(--hawkins-ink)/90">{narration ?? "Make your move to shift the balance in Hawkins."}</p>
      </div>
    );
  }
  