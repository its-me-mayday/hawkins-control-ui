import { useEffect, useRef } from "react";

type Props = { open: boolean; targetWins: number; onClose: () => void; onChangeTarget: (n: number) => void };

export default function SettingsDialog({ open, targetWins, onClose, onChangeTarget }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="rounded-2xl border border-[rgba(255,17,51,.35)] bg-[rgba(10,11,16,.92)] backdrop:bg-black/60 p-0 w-[min(92vw,420px)]"
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <div className="p-4 sm:p-5">
        <h3 className="hk-title text-sm tracking-[.28em] mb-4">SETTINGS</h3>
        <label className="block text-xs uppercase tracking-widest text-(--hawkins-muted) mb-2">First to</label>
        <select
          className="w-full bg-transparent border border-(--hawkins-muted)/30 rounded px-3 py-2 text-(--hawkins-ink)"
          value={String(targetWins)}
          onChange={(e) => onChangeTarget(parseInt(e.target.value, 10))}
        >
          {["3","5","7","10"].map(n => (<option key={n} value={n}>{n}</option>))}
        </select>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="hk-btn hk-btn--muted">Close</button>
        </div>
      </div>
    </dialog>
  );
}