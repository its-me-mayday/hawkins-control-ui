import { useEffect, useState } from "react";
import { HEROES } from "../assets/art";
import type { HeroKey } from "../constants/heroes";

type Props = {
  open: boolean;
  defaultTarget: number;
  hero: HeroKey;
  onChangeHero: (hero: HeroKey) => void;
  onStart: (rounds: number) => void;
};

const PRESETS = [1, 3, 5, 7];

const HERO_INFO: Record<HeroKey, { name: string; role: string; short: string }> = {
  DUSTIN: {
    name: "Dustin Henderson",
    role: "Brains of the Party",
    short: "Reads probabilities like dice rolls.",
  },
  HOPPER: {
    name: "Jim Hopper",
    role: "Hawkins Chief",
    short: "Takes the hit and pushes back.",
  },
  MIKE: {
    name: "Mike Wheeler",
    role: "Party Leader",
    short: "Leads like a late-night campaign.",
  },
  JOYCE: {
    name: "Joyce Byers",
    role: "Christmas Lights Oracle",
    short: "Follows every flicker until the pattern makes sense.",
  },
};

export default function StartOverlay({
  open,
  defaultTarget,
  hero,
  onChangeHero,
  onStart,
}: Props) {
  const [rounds, setRounds] = useState<number>(defaultTarget || 3);

  useEffect(() => {
    setRounds(defaultTarget || 3);
  }, [defaultTarget]);

  if (!open) return null;

  const clampedRounds = Math.max(1, Math.min(9, rounds));

  const handleSelectRounds = (value: number) => {
    const v = Math.max(1, Math.min(9, value));
    setRounds(v);
  };

  const handleStepRounds = (delta: number) => {
    handleSelectRounds(clampedRounds + delta);
  };

  const handleSelectHero = (id: HeroKey) => {
    onChangeHero(id);
  };

  const handleStart = () => {
    onStart(clampedRounds);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-50 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_0_60px_rgba(15,23,42,1)] px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="inline-flex items-center rounded-full border border-sky-500/70 bg-slate-950/90 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-sky-200 shadow-[0_0_22px_rgba(56,189,248,0.75)]">
              Match setup
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-[0.24em] uppercase text-slate-50">
              Choose character and rounds
            </h2>
            <p className="text-[0.75rem] sm:text-sm text-slate-300 leading-snug max-w-sm">
              Pick who you want to stand in for you in Hawkins, then decide how long this
              experiment will run. First to the target wins takes the match.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                Character
              </span>
              <span className="text-[0.7rem] text-slate-400">Season 1 party</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {(Object.keys(HEROES) as HeroKey[]).map((id) => {
                const active = id === hero;
                const art = HEROES[id];
                const info = HERO_INFO[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectHero(id)}
                    className={`min-w-[9.5rem] max-w-[10.5rem] rounded-2xl border px-3 py-3 text-[0.75rem] sm:text-xs flex flex-col items-center gap-2 ${
                      active
                        ? "border-rose-500/80 bg-rose-600/20 text-slate-50 shadow-[0_0_22px_rgba(248,113,113,0.85)]"
                        : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-rose-400 hover:text-rose-100"
                    }`}
                  >
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-700 bg-slate-900">
                      <img
                        src={art.src}
                        alt={art.alt}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-center">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
                        {info.name}
                      </span>
                      <span className="text-[0.65rem] text-slate-400 uppercase tracking-[0.16em]">
                        {info.role}
                      </span>
                      <span className="mt-1 text-[0.65rem] text-slate-300 leading-snug">
                        {info.short}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                  Rounds to win
                </span>
                <span className="text-xs text-slate-300">
                  First to {clampedRounds} wins.
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => handleStepRounds(-1)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-sm text-slate-200 hover:border-rose-400 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-base font-semibold tabular-nums text-slate-50">
                  {clampedRounds}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepRounds(1)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-sm text-slate-200 hover:border-rose-400 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                <span>Presets</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((value) => {
                  const active = value === clampedRounds;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelectRounds(value)}
                      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[0.75rem] uppercase tracking-[0.2em] ${
                        active
                          ? "border-rose-500/80 bg-rose-600/90 text-slate-50 shadow-[0_0_22px_rgba(248,113,113,0.85)]"
                          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-rose-400 hover:text-rose-100"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-rose-500/80 bg-rose-600/90 px-6 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-50 shadow-[0_0_26px_rgba(248,113,113,0.9)] hover:bg-rose-500 hover:border-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start match
            </button>
          </div>

          <p className="text-[0.7rem] text-slate-500 leading-snug text-center">
            You can change both character and rounds between matches from this panel.
          </p>
        </div>
      </div>
    </div>
  );
}
