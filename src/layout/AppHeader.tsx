import { useState } from "react";
import { UI_ART } from "../assets/art";
import type { HeroKey } from "../constants/heroes";

type Props = {
  targetWins: number;
  heroId: HeroKey;
  heroName: string;
  heroAvatarSrc: string;
  heroAvatarAlt: string;
  heroJustChanged: boolean;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  onNewMatch: () => void;
};

export default function AppHeader({
  targetWins,
  heroId,
  heroName,
  heroAvatarSrc,
  heroAvatarAlt,
  heroJustChanged,
  onOpenStats,
  onOpenSettings,
  onGoHome,
  onNewMatch,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroAccent = getHeroAccent(heroId);
  const burgerHeroClass = getHeroBurgerClass(heroId);

  const handleGoHome = () => {
    onGoHome();
    setMenuOpen(false);
  };

  const handleNewMatch = () => {
    onNewMatch();
    setMenuOpen(false);
  };

  const handleOpenStats = () => {
    onOpenStats();
    setMenuOpen(false);
  };

  const handleOpenSettings = () => {
    onOpenSettings();
    setMenuOpen(false);
  };

  return (
    <header className="relative z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg sm:text-xl font-semibold tracking-[0.3em] uppercase truncate">
              Hawkins Control
            </h1>
            <div className="hidden lg:flex items-center gap-2">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                Season 1 · First to {targetWins} wins
              </p>
              <div className="flex items-center">{heroAccent}</div>
            </div>
          </div>

          <div
            className={[
              "hidden lg:flex items-center gap-2 rounded-full border bg-slate-950/80 px-2.5 py-1 transition-all",
              "border-slate-700 hover:border-rose-400 hover:shadow-[0_0_18px_rgba(248,113,113,0.8)]",
              heroJustChanged ? "animate-pulse ring-1 ring-rose-500/70" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="h-7 w-7 rounded-full overflow-hidden border border-slate-700 bg-slate-900">
              <img
                src={heroAvatarSrc}
                alt={heroAvatarAlt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[0.6rem] uppercase tracking-[0.18em] text-slate-500">
                You
              </span>
              <span className="text-[0.7rem] font-semibold text-slate-100 truncate max-w-[7rem]">
                {heroName}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={[
              "hk-burger inline-flex h-9 w-9 items-center justify-center rounded-full border bg-slate-950/90 border-slate-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              burgerHeroClass,
              menuOpen ? "hk-burger--open" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="hk-burger-inner">
              <span className="hk-burger-line hk-burger-line--top" />
              <span className="hk-burger-line hk-burger-line--middle" />
              <span className="hk-burger-line hk-burger-line--bottom" />
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-slate-800 bg-slate-950/98 shadow-[0_12px_40px_rgba(15,23,42,0.9)] py-2">
              <div className="flex items-center gap-2 px-3 pb-2 border-b border-slate-800">
                <div className="h-7 w-7 rounded-full overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src={heroAvatarSrc}
                    alt={heroAvatarAlt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] text-slate-500">
                    You
                  </span>
                  <span className="text-[0.75rem] font-semibold text-slate-100 truncate">
                    {heroName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoHome}
                className="flex w-full items-center justify-between px-3 py-2 text-[0.8rem] text-slate-100 hover:bg-slate-900"
              >
                <span>Home</span>
                <img
                  src={UI_ART.HOME.src}
                  alt={UI_ART.HOME.alt}
                  className="h-4 w-4"
                  draggable={false}
                />
              </button>

              <button
                type="button"
                onClick={handleNewMatch}
                className="flex w-full items-center justify-between px-3 py-2 text-[0.8rem] text-slate-100 hover:bg-slate-900"
              >
                <span>New match</span>
                <img
                  src={UI_ART.REMATCH.src}
                  alt={UI_ART.REMATCH.alt}
                  className="h-4 w-4"
                  draggable={false}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenStats}
                className="flex w-full items-center justify-between px-3 py-2 text-[0.8rem] text-slate-100 hover:bg-slate-900"
              >
                <span>Stats</span>
                <img
                  src={UI_ART.STATS.src}
                  alt={UI_ART.STATS.alt}
                  className="h-4 w-4"
                  draggable={false}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenSettings}
                className="flex w-full items-center justify-between px-3 py-2 text-[0.8rem] text-slate-100 hover:bg-slate-900"
              >
                <span>Settings</span>
                <img
                  src={UI_ART.GEAR.src}
                  alt={UI_ART.GEAR.alt}
                  className="h-4 w-4"
                  draggable={false}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getHeroAccent(heroId: HeroKey) {
  if (heroId === "JOYCE") {
    return (
      <div className="hk-joyce-lights">
        <span className="hk-joyce-bulb hk-joyce-bulb--red" />
        <span className="hk-joyce-bulb hk-joyce-bulb--yellow" />
        <span className="hk-joyce-bulb hk-joyce-bulb--blue" />
        <span className="hk-joyce-bulb hk-joyce-bulb--green" />
        <span className="hk-joyce-bulb hk-joyce-bulb--pink" />
      </div>
    );
  }

  if (heroId === "DUSTIN") {
    return (
      <div className="hk-dustin-dots">
        <span className="hk-dustin-dot" />
        <span className="hk-dustin-dot" />
        <span className="hk-dustin-dot" />
        <span className="hk-dustin-dot" />
        <span className="hk-dustin-dot" />
      </div>
    );
  }

  if (heroId === "HOPPER") {
    return (
      <div className="hk-hopper-siren">
        <span className="hk-hopper-siren-seg hk-hopper-siren-seg--red" />
        <span className="hk-hopper-siren-seg hk-hopper-siren-seg--blue" />
      </div>
    );
  }

  if (heroId === "MIKE") {
    return (
      <div className="hk-mike-waves">
        <span className="hk-mike-wave-bar" />
        <span className="hk-mike-wave-bar" />
        <span className="hk-mike-wave-bar" />
        <span className="hk-mike-wave-bar" />
      </div>
    );
  }

  return null;
}

function getHeroBurgerClass(heroId: HeroKey) {
  if (heroId === "JOYCE") return "hk-burger--joyce";
  if (heroId === "DUSTIN") return "hk-burger--dustin";
  if (heroId === "HOPPER") return "hk-burger--hopper";
  if (heroId === "MIKE") return "hk-burger--mike";
  return "";
}
