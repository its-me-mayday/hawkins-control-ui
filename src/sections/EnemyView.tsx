type EnemyViewProps = {
    choice?: string | null;
  };
  
  export default function EnemyView({ choice }: EnemyViewProps) {
    return (
      <div className="text-sm text-(--hawkins-ink) opacity-85">
        {choice ? (
          <>Computer chose <strong>{choice.replaceAll("_", " ")}</strong></>
        ) : (
          <>Waiting for your move…</>
        )}
      </div>
    );
  }
  