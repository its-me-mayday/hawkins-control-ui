import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

type Outcome = "PLAYER" | "ENEMY" | "DRAW";

type StrangerCardProps = {
  label: HawkinsSymbol;
  selected?: boolean;
  outcomeForSelected?: Outcome | null;
  onSelect?: () => void;
  imageSrc?: string;
  imageWinSrc?: string;
  imageLoseSrc?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  aspect?: string;
  useWinImage?: boolean;
  useLoseImage?: boolean;
  className?: string;
  titleSize?: "sm" | "md";
};

const ACCENT_BY_SYMBOL: Record<HawkinsSymbol, string> = {
  ELEVEN: "var(--accent-eleven)",
  DEMOGORGON: "var(--accent-demog)",
  HAWKINS_LAB: "var(--accent-lab)",
};

export default function StrangerCard({
  label,
  selected = false,
  outcomeForSelected = null,
  onSelect,
  imageSrc,
  imageWinSrc,
  imageLoseSrc,
  imageAlt,
  imageFit = "contain",
  imagePosition = "center",
  aspect = "4/3",
  useWinImage = false,
  useLoseImage = false,
  className = "",
  titleSize = "md",
}: StrangerCardProps) {
  const accent = ACCENT_BY_SYMBOL[label];

  const outcomeAnim =
    selected && outcomeForSelected === "PLAYER"
      ? "animate-card-win"
      : selected && outcomeForSelected === "ENEMY"
      ? "animate-card-lose"
      : selected && outcomeForSelected === "DRAW"
      ? "animate-card-draw"
      : "";

  const effectiveSrc =
    useWinImage && imageWinSrc
      ? imageWinSrc
      : useLoseImage && imageLoseSrc
      ? imageLoseSrc
      : imageSrc;

  const imgGlitch = selected && outcomeForSelected === "ENEMY" ? "hk-img-glitch" : "";
  const loseTone = selected && outcomeForSelected === "ENEMY" ? "saturate-[.85]" : "";

  return (
    <button
      onClick={onSelect}
      className={[
        "hk-card w-full text-left transition-all overflow-hidden focus:outline-none",
        selected ? "ring-2 ring-[var(--hawkins-red)] ring-offset-0" : "",
        outcomeAnim,
        className,
      ].join(" ")}
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 16px ${accent}33, inset 0 0 18px ${accent}1A`,
      }}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{
          aspectRatio: aspect,
          background:
            "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.35)), radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,.06), transparent 60%)",
        }}
      >
        {effectiveSrc ? (
          <img
            src={effectiveSrc}
            alt={imageAlt || label.replace("_", " ")}
            loading="lazy"
            className={[
              "h-full w-full transition-transform duration-200 will-change-transform",
              imageFit === "contain" ? "object-contain" : "object-cover",
              imgGlitch,
              loseTone,
            ].join(" ")}
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[color:var(--hawkins-muted)]">No image</div>
        )}

        {imageFit === "contain" && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12),transparent_30%,transparent_70%,rgba(0,0,0,.18))]" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 24px rgba(0,0,0,.25)" }}
            />
          </>
        )}
      </div>

      <div className="mt-3 text-center uppercase tracking-widest">
        <span
          className={titleSize === "sm" ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
          style={{ color: accent }}
        >
          {label.replaceAll("_", " ")}
        </span>
      </div>
    </button>
  );
}
