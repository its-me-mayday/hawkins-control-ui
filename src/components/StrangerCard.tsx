type Outcome = "PLAYER" | "ENEMY" | "DRAW"

type StrangerCardProps = {
    label: string;
    selected?: boolean;
    outcomeForSelected?: Outcome | null;
    onSelect?: () => void;
  };
  
  export default function StrangerCard({ label, selected, outcomeForSelected, onSelect }: StrangerCardProps) {
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
        "hk-card w-full text-center uppercase tracking-widest transition-all",
        "focus:outline-none",
          selected ? "ring-2 ring-(--hawkins-red) ring-offset-0" : "",
          outcomeAnim
        ].join(" ")}
      >
        <span className="text-(--hawkins-red) text-sm sm:text-base">
          {label.replace("_", " ")}
        </span>
      </button>
    );
  }
  