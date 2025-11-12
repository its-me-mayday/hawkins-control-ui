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
      className="rounded-2xl border border-[rgba(255,17,51,.35)] bg-[rgba(10,11,16,.92)]
                 backdrop:bg-black/60 p-0 w-[min(92vw,420px)]"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="p-4 sm:p-5 space-y-5">
        <h3 className="hk-title text-sm tracking-[.28em]">SETTINGS</h3>

        <div className="hk-card flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-(--hawkins-muted)">Music</div>
            <div className="text-[13px] opacity-80">80s ambience background</div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={musicOn}
              onChange={(e) => onToggleMusic(e.target.checked)}
            />
            <span className={`w-11 h-6 rounded-full transition ${musicOn ? "bg-(--hawkins-red)" : "bg-white/20"}`}>
              <span
                className={`block w-5 h-5 bg-white rounded-full transition translate-y-[2px] ${
                  musicOn ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </label>
        </div>

        <div className="hk-card">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-(--hawkins-muted)">Music Volume</div>
            <div className="text-[12px] opacity-80">{Math.round(musicVolume * 100)}%</div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(musicVolume * 100)}
            onChange={(e) => onChangeMusicVolume(Number(e.target.value) / 100)}
            className="w-full mt-2"
          />
        </div>

        <div className="hk-card flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-(--hawkins-muted)">SFX</div>
            <div className="text-[13px] opacity-80">pick / win / lose / draw</div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={sfxOn}
              onChange={(e) => onToggleSfx(e.target.checked)}
            />
            <span className={`w-11 h-6 rounded-full transition ${sfxOn ? "bg-(--hawkins-red)" : "bg-white/20"}`}>
              <span
                className={`block w-5 h-5 bg-white rounded-full transition translate-y-[2px] ${
                  sfxOn ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="hk-btn hk-btn--muted">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
