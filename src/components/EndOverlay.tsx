// src/components/EndOverlay.tsx
type Props = {
    open: boolean;
    winnerText: string | null;
    onNewMatch: () => void;
  };
  
  export default function EndOverlay({ open, winnerText, onNewMatch }: Props) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 40%, rgba(0,0,0,0.40), rgba(0,0,0,0.75) 38%, rgba(0,0,0,1) 68%)",
          }}
        />
        <div
          className="relative w-full max-w-md rounded-2xl p-6 border text-center"
          style={{
            background: "var(--hawkins-bg)",
            borderColor: "rgba(255,17,51,0.35)",
            boxShadow: "0 8px 26px rgba(0,0,0,.55), 0 0 22px rgba(255,17,51,.12)",
          }}
        >
          <h2 className="hk-title text-xl mb-2">Match Over</h2>
          <p className="text-(--hawkins-muted) text-sm mb-4 uppercase tracking-widest">
            {winnerText ?? "The match has ended"}
          </p>
          <button className="hk-btn hk-btn--danger hk-btn--shine" onClick={onNewMatch}>
            New Match
          </button>
        </div>
      </div>
    );
  }  