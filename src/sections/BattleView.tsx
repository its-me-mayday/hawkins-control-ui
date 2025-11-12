type BattleViewProps = {
    narration?: string | null;
    result?: "PLAYER" | "ENEMY" | "DRAW" | null;
  };
  export default function BattleView({ narration, result }: BattleViewProps) {
    const anim =
    result === "PLAYER"
      ? "animate-hk-win"
      : result === "ENEMY"
      ? "animate-hk-lose"
      : result === "DRAW"
      ? "animate-hk-draw"
      : "";

  const tone =
    result === "PLAYER"
      ? "text-emerald-400"
      : result === "ENEMY"
      ? "text-rose-400"
      : result === "DRAW"
      ? "text-sky-400"
      : "text-[color:var(--hawkins-muted)]";

    return (
    <div className={`space-y-2 ${anim}`}>
      <div className={`text-xs uppercase tracking-widest ${tone}`}>
        {result === "PLAYER" && "YOU WIN"}
        {result === "ENEMY" && "YOU LOSE"}
        {result === "DRAW" && "DRAW"}
        {!result && "No clash yet"}
        </div>
        <p className="text-sm text-(--hawkins-ink)/90">{narration ?? "Make your move to shift the balance in Hawkins."}</p>
      </div>
    );
  }
  