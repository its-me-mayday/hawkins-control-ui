type Props = {
    player: number;
    enemy: number;
    targetWins: number;
  };
  
  export default function MatchBadge({ player, enemy, targetWins }: Props) {
    const leading = player === enemy ? "Tie" : player > enemy ? "You" : "Enemy";
    const leadingClass =
      leading === "You" ? "text-emerald-400" : leading === "Enemy" ? "text-rose-400" : "text-sky-400";
  
    return (
      <div
        className="hk-card px-3 py-2 rounded-full flex items-baseline gap-2 text-[12px] md:text-[13px]"
        style={{
          borderColor: "rgba(255,17,51,.35)",
          boxShadow: "0 0 16px rgba(255,17,51,.25), inset 0 0 18px rgba(53,192,255,.08)",
        }}
      >
        <span className="uppercase tracking-widest text-(--hawkins-muted)">Match</span>
        <span className="font-semibold">You {player} — {enemy} Enemy</span>
        <span className="uppercase tracking-widest text-(--hawkins-muted)/85">• First to {targetWins}</span>
        <span className={`uppercase tracking-widest ${leadingClass}`}>{leading}</span>
      </div>
    );
  }
  