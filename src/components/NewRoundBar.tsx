type Props = {
    visible: boolean;
    onNext: () => void;
  };
  
  export default function NewRoundBar({ visible, onNext }: Props) {
    if (!visible) return null;
    return (
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="hk-btn hk-btn--ghost hk-btn--shine hk-btn--magnetic"
          title="Start a new round"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 4l10 8-10 8V4z" />
            <path d="M19 5v14" />
          </svg>
          New Round
        </button>
      </div>
    );
  }  