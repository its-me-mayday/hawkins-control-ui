import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

type Outcome = "PLAYER" | "ENEMY" | "DRAW";

type StrangerCardProps = {
  label: HawkinsSymbol;
  selected?: boolean;
  outcomeForSelected?: Outcome | null;
  onSelect?: () => void;
  imageSrc?: string;
  imageWinSrc?: string,
  imageLoseSrc?: string,
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  aspect?: string;
  useWinImage?: boolean;
  useLoseImage?: boolean;
};

const ACCENT_BY_SYMBOL: Record<HawkinsSymbol, string> = {
  ELEVEN: "var(--accent-eleven)",
  DEMOGORGON: "var(--accent-demog)",
  HAWKINS_LAB: "var(--accent-lab)",
};

export default function StrangerCard({
  label,
  selected,
  outcomeForSelected,
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

  const imgGlitch = selected && outcomeForSelected === "ENEMY" ? "hk-img-glitch" : "";
  const effectiveSrc = useWinImage && imageWinSrc ? imageWinSrc : useLoseImage && imageLoseSrc ? imageLoseSrc : imageSrc;

  
  return (
    <button
      onClick={onSelect}
      className={[
        "hk-card w-full text-left transition-all overflow-hidden",
        "focus:outline-none",
        selected ? "ring-2 ring-[var(--hawkins-red)] ring-offset-0" : "",
        outcomeAnim,
      ].join(" ")}
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 16px ${accent}33, inset 0 0 18px ${accent}1A`,
      }}
    >
      <div
        className={`relative w-full overflow-hidden rounded-lg aspect-[${aspect}]`}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.35)), radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,.06), transparent 60%)",
        }}
      >
        {imageSrc ? (
          <img
            src={effectiveSrc}
            alt={imageAlt || label.replace("_", " ")}
            loading="lazy"
            className={[
              "h-full w-full transition-transform duration-200 will-change-transform",
              imageFit === "contain" ? "object-contain" : "object-cover",
              imgGlitch,
            ].join(" ")}
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[color:var(--hawkins-muted)]">
            No image
          </div>
        )}

        {/* bande “letterbox” morbide quando usi contain */}
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
        <span className="text-sm sm:text-base" style={{ color: accent }}>
          {label.replace("_", " ")}
        </span>
      </div>
    </button>
  );
}
