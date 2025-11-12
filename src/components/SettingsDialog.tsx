import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number;
  onToggleMusic: (v: boolean) => void;
  onToggleSfx: (v: boolean) => void;
  onChangeMusicVolume: (v: number) => void;
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
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
<dialog
  ref={ref}
  className="hk-dialog rounded-xl border border-[rgba(255,17,51,.35)] bg-[rgba(10,11,16,.92)]
             backdrop:bg-black/60 p-0 w-[min(92vw,360px)]"
  onClose={onClose}
  onCancel={(e) => { e.preventDefault(); onClose(); }}
>
      <div className="p-3 sm:p-4 space-y-3">
        <h3 className="hk-title text-xs tracking-[.28em]">SETTINGS</h3>

        <div className="hk-card px-3 py-2 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest font-semibold hk-title">Music</div>
          <label className="inline-flex items-center gap-2 cursor-pointer" aria-label="Toggle music">
            <input
              type="checkbox"
              className="sr-only"
              checked={musicOn}
              onChange={(e) => onToggleMusic(e.target.checked)}
            />
            <span className={`w-9 h-5 rounded-full transition ${musicOn ? "bg-(--hawkins-red)" : "bg-white/20"}`}>
              <span
                className={`block w-4 h-4 bg-white rounded-full transition translate-y-[2px] ${
                  musicOn ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </label>
        </div>

        {musicOn && (
          <div className="hk-card px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-widest font-semibold hk-title">Volume</div>
              <div className="text-[11px] opacity-80 font-semibold hk-title">{Math.round(musicVolume * 100)}%</div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(musicVolume * 100)}
              onChange={(e) => onChangeMusicVolume(Number(e.target.value) / 100)}
              className="w-full mt-1.5"
              aria-label="Music volume"
            />
          </div>
        )}

        <div className="hk-card px-3 py-2 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest font-semibold hk-title">SFX</div>
          <label className="inline-flex items-center gap-2 cursor-pointer" aria-label="Toggle SFX">
            <input
              type="checkbox"
              className="sr-only"
              checked={sfxOn}
              onChange={(e) => onToggleSfx(e.target.checked)}
            />
            <span className={`w-9 h-5 rounded-full transition ${sfxOn ? "bg-(--hawkins-red)" : "bg-white/20"}`}>
              <span
                className={`block w-4 h-4 bg-white rounded-full transition translate-y-[2px] ${
                  sfxOn ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={onClose} className="hk-btn hk-btn--muted text-sm px-3 py-1.5">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
