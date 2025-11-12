type Props = {
    targetWins: number;
    disabledSelect: boolean;
    onChangeTarget: (n: number) => void;
    onResetMatch: () => void;
  };
  
  export default function ControlsBar({
    targetWins,
    disabledSelect,
    onChangeTarget,
    onResetMatch,
  }: Props) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-widest text-(--hawkins-muted)">
          First to{" "}
          <select
            className="bg-transparent border border-(--hawkins-muted)/30 rounded px-2 py-1"
            value={targetWins}
            onChange={(e) => onChangeTarget(Number(e.target.value))}
            disabled={disabledSelect}
          >
            {[3, 5, 7, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
  
        <div className="flex gap-2">
          <button onClick={onResetMatch} className="hk-btn hk-btn--danger" title="Reset match and scores">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v10" />
              <path d="M7.5 4.2A9 9 0 1 0 16.5 4.2" />
            </svg>
            Reset Match
          </button>
        </div>
      </div>
    );
  }
  