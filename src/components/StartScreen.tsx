type Props = {
  onEnter: () => void;
  logoSrc?: string;
  logoAlt?: string;
};

export default function StartScreen({
  onEnter,
  logoSrc,
  logoAlt = "Hawkins Control icon",
}: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[radial-gradient(circle_at_top,_#f97316_0,_transparent_55%),radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />

      <div className="relative w-full max-w-xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          {logoSrc && (
            <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(248,250,252,0.35)]">
              <img
                src={logoSrc}
                alt={logoAlt}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.35em] uppercase">
              Hawkins Control
            </h1>
            <p className="text-[0.7rem] sm:text-xs tracking-[0.25em] uppercase text-slate-400">
              Stranger Things • Rock – Paper – Scissors
            </p>
          </div>

          <p className="max-w-md text-sm sm:text-base text-slate-300/90">
            Choose between Eleven, Demogorgon and Hawkins Lab and try to outsmart
            your opponent. First to reach the target number of wins takes the match.
          </p>

          <button
            type="button"
            onClick={onEnter}
            className="mt-2 inline-flex items-center justify-center rounded-full px-10 py-3
                       text-sm sm:text-base font-semibold tracking-[0.25em] uppercase
                       bg-rose-600/90 hover:bg-rose-500 active:bg-rose-700
                       shadow-[0_0_18px_rgba(248,113,113,0.8)] animate-pulse
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
                       focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
