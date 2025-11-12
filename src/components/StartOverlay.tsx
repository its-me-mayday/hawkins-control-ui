// src/components/StartOverlay.tsx
type Props = {
    open: boolean;
    defaultTarget: number;
    onStart: (rounds: number) => void;
  };
  
  const OPTIONS = [3, 5, 7, 10];
  
  export default function StartOverlay({ open, defaultTarget, onStart }: Props) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
        {/* Backdrop pieno (quasi nero) */}
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,0.10), rgba(0,0,0,0.10) 38%, rgba(0,0,0,1) 68%)",
          }}
        />
  
        {/* Pannello OPACO (no hk-panel) */}
        <div
          className="relative w-full max-w-md rounded-2xl p-6 border"
          style={{
            background: "var(--hawkins-bg)",              // pieno
            borderColor: "rgba(255,17,51,0.35)",          // rosso tenue
            boxShadow:
              "0 8px 26px rgba(0,0,0,.55), 0 0 22px rgba(255,17,51,.12), inset 0 0 0 rgba(0,0,0,0)", // niente glow interno
          }}
        >
          <header className="text-center mb-4">
            <h2 className="hk-title text-xl">Start Match</h2>
            <p className="text-(--hawkins-muted) mt-1 text-xs uppercase tracking-widest">
              Choose how many rounds to win
            </p>
          </header>
  
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-(--hawkins-muted)">
              First to
              <select
                className="mt-1 w-full rounded px-3 py-2 text-(--hawkins-ink) border border-(--hawkins-muted)/30 bg-[color:var(--hawkins-bg2)]"
                defaultValue={String(defaultTarget)}
                onChange={(e) => {
                  const v = Number(e.target.value || defaultTarget);
                  const btn = document.getElementById("start-btn") as HTMLButtonElement | null;
                  if (btn) btn.dataset.rounds = String(v);
                }}
              >
                {OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
  
            <div className="flex justify-center">
              <button
                id="start-btn"
                data-rounds={String(defaultTarget)}
                className="hk-btn hk-btn--danger hk-btn--shine"
                onClick={(e) => onStart(Number((e.currentTarget as HTMLButtonElement).dataset.rounds))}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  