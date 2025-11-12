type Props = {
    onStart: (rounds: number) => void;
    defaultTarget?: number;
    disabled?: boolean;
  };
  
  export default function MatchSetupPanel({ onStart, defaultTarget = 5, disabled }: Props) {
    const choices = ["3", "5", "7", "10"];
    const placeholder = "Select rounds";
    const hasDefault = choices.includes(String(defaultTarget));
    return (
      <div className="hk-panel space-y-3 sticky top-8">
        <h3 className="hk-title text-xs tracking-[.28em]">START MATCH</h3>
        <div className="grid grid-cols-1 gap-2">
          <label className="text-[11px] uppercase tracking-widest text-[color:var(--hawkins-muted)]">
            First to
          </label>
          <select
            className="w-full bg-transparent border border-[color:var(--hawkins-muted)]/30 rounded px-3 py-2
                       text-[color:var(--hawkins-ink)]"
            defaultValue={hasDefault ? String(defaultTarget) : ""}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value;
              (e.currentTarget as any)._sel = v;
            }}
          >
            <option value="" disabled>{placeholder}</option>
            {choices.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            className="hk-btn hk-btn--ghost"
            disabled={disabled}
            onClick={(e) => {
              const sel = (e.currentTarget.previousElementSibling as HTMLSelectElement & { _sel?: string })._sel;
              const val = sel ?? (hasDefault ? String(defaultTarget) : "");
              if (!val) return;
              onStart(parseInt(val, 10));
            }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }  