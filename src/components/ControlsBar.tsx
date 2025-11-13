type Props = {
  targetWins: number;
  disabledSelect?: boolean;
  onChangeTarget: (value: number) => void;
  showTarget?: boolean;
};

const PRESETS = [1, 3, 5, 7];

export default function ControlsBar({
  targetWins,
  disabledSelect = false,
  onChangeTarget,
  showTarget = true,
}: Props) {
  const clampedTarget = Math.max(1, Math.min(9, targetWins));
  const isDisabled = disabledSelect;

  const handleSet = (value: number) => {
    if (isDisabled) return;
    const v = Math.max(1, Math.min(9, value));
    onChangeTarget(v);
  };

  const handleStep = (delta: number) => {
    handleSet(clampedTarget + delta);
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm ${
        isDisabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
            Rounds to win
          </span>
          {showTarget && (
            <span className="text-[0.7rem] text-slate-300">
              First to {clampedTarget} wins takes the match.
            </span>
          )}
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-[0.75rem] text-slate-200 hover:border-rose-400 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            −
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums text-slate-50">
            {clampedTarget}
          </span>
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-[0.75rem] text-slate-200 hover:border-rose-400 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
          Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((value) => {
            const active = value === clampedTarget;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleSet(value)}
                className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[0.7rem] uppercase tracking-[0.18em] ${
                  active
                    ? "border-rose-500/80 bg-rose-600/90 text-slate-50 shadow-[0_0_18px_rgba(248,113,113,0.8)]"
                    : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-rose-400 hover:text-rose-100"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
