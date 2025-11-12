type StrangerCardProps = {
    label: string;
    selected?: boolean;
  };
  
  export default function StrangerCard({ label, selected }: StrangerCardProps) {
    return (
      <button
        className={[
          "hk-card w-full text-center uppercase tracking-widest transition-all",
          selected ? "ring-2 ring-(--hawkins-red) ring-offset-0" : ""
        ].join(" ")}
      >
        <span className="text-(--hawkins-red) text-sm sm:text-base">
          {label.replace("_", " ")}
        </span>
      </button>
    );
  }
  