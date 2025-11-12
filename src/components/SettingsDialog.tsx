import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  ambienceEnabled: boolean;
  sfxEnabled: boolean;
  onToggleAmbience: () => void;
  onToggleSfx: () => void;
  onClose: () => void;
};

export default function SettingsDialog({
  open,
  ambienceEnabled,
  sfxEnabled,
  onToggleAmbience,
  onToggleSfx,
  onClose,
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
                 backdrop:bg-black/60 p-0 w-[min(92vw,460px)]"
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <div className="p-4 sm:p-5 space-y-5">
        <h3 className="hk-title text-sm tracking-[.28em]">SETTINGS</h3>

        <div className="grid gap-3">
          <ToggleRow
            label="Ambience ’80s"
            checked={ambienceEnabled}
            onClick={onToggleAmbience}
          />
          <ToggleRow
            label="Sound Effects"
            checked={sfxEnabled}
            onClick={onToggleSfx}
          />
        </div>

        <div className="mt-2 flex justify-end">
          <button onClick={onClose} className="hk-btn hk-btn--muted">Close</button>
        </div>
      </div>
    </dialog>
  );
}

function ToggleRow({
  label,
  checked,
  onClick,
}: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 px-3 rounded border border-(--hawkins-muted)/20">
      <span className="text-xs uppercase tracking-widest text-(--hawkins-muted)">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onClick}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-emerald-500/70" : "bg-white/15"
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            checked ? "translate-x-6" : "translate-x-1"
          ].join(" ")}
        />
      </button>
    </label>
  );
}
