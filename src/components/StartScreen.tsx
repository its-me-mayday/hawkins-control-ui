type Props = {
    onEnter: () => void;
    logoSrc?: string;
    logoAlt?: string;
  };
  
  export default function StartScreen({ onEnter, logoSrc, logoAlt = "Logo" }: Props) {
    return (
      <div className="relative min-h-screen overflow-hidden grid place-items-center px-6 py-10">
        <style>{`
          @keyframes hkPulse {
            0%, 100% { opacity: .9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
          }
        `}</style>
  
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 50% at 50% 35%, rgba(255,0,80,0.12), transparent 60%), radial-gradient(70% 60% at 50% 65%, rgba(0,200,255,0.10), transparent 70%), linear-gradient(180deg, #07080c 0%, #0a0b12 60%, #07080c 100%)",
            animation: "hkPulse 7s ease-in-out infinite",
          }}
        />
  
        <div className="relative text-center space-y-8 sm:space-y-10">
          <div className="mx-auto w-[12rem] sm:w-56 md:w-[10rem] aspect-square">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={logoAlt}
                className="block w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-[11px] tracking-widest uppercase text-white/50">
                Your Icon
              </div>
            )}
          </div>
  
          <h1
            className="hk-title animate-hk-flash leading-tight"
            style={{ fontSize: "clamp(3rem, 5vw, 9rem)" }}
          >
            Hawkins Control
          </h1>
  
          <button
            className="hk-btn hk-btn--danger hk-btn--shine text-lg md:text-xl px-8 py-3 md:px-10 md:py-4"
            onClick={onEnter}
          >
            Play
          </button>
        </div>
      </div>
    );
  }
  