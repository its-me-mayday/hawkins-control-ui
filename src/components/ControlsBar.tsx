type Props = {
    targetWins: number;
    disabledSelect: boolean;
    onChangeTarget: (n: number) => void;
    showTarget?: boolean;
  };
  
  export default function ControlsBar({
    targetWins,
    disabledSelect,
    onChangeTarget,
    showTarget = false,
  }: Props) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {showTarget ? (
          <div className="text-xs uppercase tracking-widest text-[color:var(--hawkins-muted)]">
            First to{" "}
            <select
              className="bg-transparent border border-[color:var(--hawkins-muted)]/30 rounded px-2 py-1
                         text-[color:var(--hawkins-ink)]"
              value={String(targetWins)}
              onChange={(e) => onChangeTarget(parseInt(e.target.value, 10))}
              disabled={disabledSelect}
            >
              {["3","5","7","10"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ) : <div />}
        <div />
      </div>
    );
  }
  