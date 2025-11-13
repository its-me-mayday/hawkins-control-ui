type Outcome = "PLAYER" | "ENEMY" | "DRAW" | null;

type Props = {
  label: string;
  selected: boolean;
  outcomeForSelected: Outcome;
  imageSrc: string;
  imageWinSrc: string;
  imageLoseSrc: string;
  imageAlt: string;
  imageFit?: string;
  imagePosition?: string;
  useWinImage?: boolean;
  useLoseImage?: boolean;
  aspect?: string;
  onSelect: () => void;
  className?: string;
  titleSize?: "sm" | "md";
};

export default function StrangerCard({
  label,
  selected,
  outcomeForSelected,
  imageSrc,
  imageWinSrc,
  imageLoseSrc,
  imageAlt,
  imageFit,
  imagePosition,
  useWinImage,
  useLoseImage,
  aspect,
  onSelect,
  className,
  titleSize = "md",
}: Props) {
  let src = imageSrc;
  if (useWinImage) src = imageWinSrc;
  else if (useLoseImage) src = imageLoseSrc;

  const baseBorder = "border-slate-700/80";
  const selectedBorder = "border-rose-500/80";
  const winBorder = "border-emerald-400/90";
  const loseBorder = "border-rose-500/90";
  const drawBorder = "border-slate-400/80";

  let borderClass = baseBorder;
  if (selected) {
    if (outcomeForSelected === "PLAYER") borderClass = winBorder;
    else if (outcomeForSelected === "ENEMY") borderClass = loseBorder;
    else if (outcomeForSelected === "DRAW") borderClass = drawBorder;
    else borderClass = selectedBorder;
  }

  const glowSelected =
    outcomeForSelected === "PLAYER"
      ? "shadow-[0_0_26px_rgba(52,211,153,0.75)]"
      : outcomeForSelected === "ENEMY"
      ? "shadow-[0_0_26px_rgba(248,113,113,0.75)]"
      : outcomeForSelected === "DRAW"
      ? "shadow-[0_0_20px_rgba(148,163,184,0.6)]"
      : selected
      ? "shadow-[0_0_18px_rgba(244,63,94,0.7)]"
      : "shadow-none";

  const titleSizeClass =
    titleSize === "sm"
      ? "text-xs sm:text-sm"
      : "text-sm sm:text-base";

  const aspectClass = aspect || "aspect-[4/5]";
  const fitClass = imageFit || "object-contain";
  const posClass = imagePosition || "object-center";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full ${className ?? ""}`}
    >
      <div
        className={`flex h-full flex-col rounded-2xl border ${borderClass} bg-slate-950/90 px-2.5 py-2.5 sm:px-3 sm:py-3 transition-all duration-200 ease-out ${glowSelected} hover:-translate-y-1 hover:shadow-[0_0_26px_rgba(248,250,252,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className={`${titleSizeClass} font-semibold uppercase tracking-[0.18em] text-slate-100 truncate`}
          >
            {label}
          </span>
          {selected && (
            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-rose-300/90">
              Selected
            </span>
          )}
        </div>

        <div className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-slate-900/80`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_top,_#f97316_0,_transparent_55%),radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
          <img
            src={src}
            alt={imageAlt}
            className={`h-full w-full ${fitClass} ${posClass} transition-transform duration-200 group-hover:scale-[1.04]`}
            draggable={false}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[0.65rem] text-slate-400 uppercase tracking-[0.16em]">
          <span>
            {outcomeForSelected === "PLAYER" && "Round win"}
            {outcomeForSelected === "ENEMY" && "Round loss"}
            {outcomeForSelected === "DRAW" && "Round draw"}
            {!outcomeForSelected && "Ready"}
          </span>
          <span className="opacity-70">Stranger Card</span>
        </div>
      </div>
    </button>
  );
}
