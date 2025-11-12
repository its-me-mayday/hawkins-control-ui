type EnemyViewProps = {
    choice?: string | null;
  };
  export default function EnemyView({ choice }: EnemyViewProps) {
    return (
      <div className="text-sm text-(--hawkins-ink)/85">
        {choice ? <>Computer chose <strong>{choice.replace("_"," ")}</strong></> : <>Waiting for your move…</>}
      </div>
    );
  }