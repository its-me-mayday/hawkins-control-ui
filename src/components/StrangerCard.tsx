type Outcome = "PLAYER" | "ENEMY" | "DRAW";

type StrangerCardProps = {
  label: string;                 // es. "ELEVEN"
  selected?: boolean;
  outcomeForSelected?: Outcome | null;
  onSelect?: () => void;
  imageSrc?: string;             // passata da fuori
  imageAlt?: string;
};

export default function StrangerCard({
  label,
  selected,
  outcomeForSelected,
  onSelect,
  imageSrc,
  imageAlt,
}: StrangerCardProps) {
  const outcomeAnim =
    selected && outcomeForSelected === "PLAYER"
      ? "animate-card-win"
      : selected && outcomeForSelected === "ENEMY"
      ? "animate-card-lose"
      : selected && outcomeForSelected === "DRAW"
      ? "animate-card-draw"
      : "";

  return (
    <button
      onClick={onSelect}
      className={[
        "hk-card w-full text-left transition-all overflow-hidden",
        "focus:outline-none",
        selected ? "ring-2 ring-[var(--hawkins-red)] ring-offset-0" : "",
        outcomeAnim,
      ].join(" ")}
    >
      {/* media area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || label.replace("_", " ")}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 will-change-transform hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[color:var(--hawkins-muted)]">
            No image
          </div>
        )}
        {/* overlay leggero */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/20" />
      </div>

      {/* label */}
      <div className="mt-3 text-center uppercase tracking-widest">
        <span className="text-[color:var(--hawkins-red)] text-sm sm:text-base">
          {label.replace("_", " ")}
        </span>
      </div>
    </button>
  );
}