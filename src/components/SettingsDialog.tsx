import type { ChangeEvent } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number;
  onToggleMusic: (value: boolean) => void;
  onToggleSfx: (value: boolean) => void;
  onChangeMusicVolume: (value: number) => void;
};

export default function SettingsDialog({
  open,
  onClose,
  musicOn,
  sfxOn,
  musicVolume,
  onToggleMusic,
  onToggleSfx,
  onChangeMusicVolume,
}: Props) {
  if (!open) return null;

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onChangeMusicVolume(value);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-100">
              Control Room
            </h2>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
              Audio and ambience
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:border-rose-500 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            ×
          </button>
        </div>

        <div className="px-4 pt-4 pb-4 sm:pb-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                  Music
                </span>
                <span className="text-xs text-slate-300">
                  Upside Down ambience and neon pulses.
                </span>
              </div>
              <ToggleSwitch
                checked={musicOn}
                onChange={onToggleMusic}
                labelOff="Off"
                labelOn="On"
                tone="rose"
              />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[0.7rem] text-slate-400 mb-1">
                <span className="uppercase tracking-[0.2em]">Music volume</span>
                <span className="tabular-nums text-slate-300">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={musicVolume}
                onChange={handleVolumeChange}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                  Sound effects
                </span>
                <span className="text-xs text-slate-300">
                  Clicks, hits and round feedback.
                </span>
              </div>
              <ToggleSwitch
                checked={sfxOn}
                onChange={onToggleSfx}
                labelOff="Off"
                labelOn="On"
                tone="sky"
              />
            </div>

            <p className="text-[0.7rem] leading-snug text-slate-400">
              Keep this on if you want each round to feel like a real Hawkins experiment.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-[0.7rem] text-slate-400 leading-snug">
            <p>
              Audio settings are stored locally on this device. Changing them will not affect
              any other Hawkins terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  labelOff: string;
  labelOn: string;
  tone: "rose" | "sky";
};

function ToggleSwitch({ checked, onChange, labelOff, labelOn, tone }: ToggleProps) {
  const activeBg =
    tone === "rose" ? "bg-rose-500 shadow-[0_0_14px_rgba(248,113,113,0.9)]" : "bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.9)]";
  const trackBg = checked ? activeBg : "bg-slate-700";
  const knobTranslate = checked ? "translate-x-4" : "translate-x-0";

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-300"
    >
      <span className="text-slate-500">{labelOff}</span>
      <div
        className={`relative flex h-5 w-9 items-center rounded-full px-0.5 transition-all duration-150 ${trackBg}`}
      >
        <div
          className={`h-4 w-4 rounded-full bg-slate-950 transition-transform duration-150 ${knobTranslate}`}
        />
      </div>
      <span className={checked ? "text-slate-100" : "text-slate-500"}>{labelOn}</span>
    </button>
  );
}
