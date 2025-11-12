import type { HawkinsSymbol } from "@its-me-mayday/hawkins-control";

type Outcome = "PLAYER" | "ENEMY" | "DRAW";

type StrangerCardProps = {
  label: HawkinsSymbol;             // usa il tipo della lib
  selected?: boolean;
  outcomeForSelected?: Outcome | null;
  onSelect?: () => void;
  imageSrc?: string;
  imageAlt?: string;
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
  imageAlt,
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

  // glitch solo se questa card è la selezionata e hai perso
  const imgGlitch = selected && outcomeForSelected === "ENEMY" ? "hk-img-glitch" : "";

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
        // bordo/ombra del pannello card colorati per-simbolo
        borderColor: `${accent}55`,
        boxShadow: `0 0 16px ${accent}33, inset 0 0 18px ${accent}1A`,
      }}
    >
      {/* media */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || label.replace("_", " ")}
            loading="lazy"
            className={[
              "h-full w-full object-cover transition-transform duration-200 will-change-transform",
              "hover:scale-[1.03]",
              imgGlitch,
            ].join(" ")}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[color:var(--hawkins-muted)]">
            No image
          </div>
        )}

        {/* overlay gradiente per-simbolo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${accent}22 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* label */}
      <div className="mt-3 text-center uppercase tracking-widest">
        <span
          className="text-sm sm:text-base"
          style={{ color: accent }}
        >
          {label.replace("_", " ")}
        </span>
      </div>
    </button>
  );
}
