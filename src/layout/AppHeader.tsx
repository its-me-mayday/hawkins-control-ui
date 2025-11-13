import IconButton from "../components/IconButton";
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
}: Props) {
  const heroAccent = getHeroAccent(heroId);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg sm:text-xl font-semibold tracking-[0.3em] uppercase truncate">
              Hawkins Control
            </h1>
            <div className="flex items-center gap-2">
              <p className="hidden text-[0.7rem] uppercase tracking-[0.2em] text-slate-400 sm:block">
                Season 1 · First to {targetWins} wins
              </p>
              <div className="hidden sm:flex items-center">
                {heroAccent}
              </div>
            </div>
          </div>

          <div
            className={[
              "hidden sm:flex items-center gap-2 rounded-full border bg-slate-950/80 px-2.5 py-1 transition-all",
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={[
              "flex sm:hidden items-center gap-2 rounded-full border bg-slate-950/80 px-2 py-0.5 transition-all",
              "border-slate-700 hover:border-rose-400 hover:shadow-[0_0_18px_rgba(248,113,113,0.8)]",
              heroJustChanged ? "animate-pulse ring-1 ring-rose-500/70" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="h-6 w-6 rounded-full overflow-hidden border border-slate-700 bg-slate-900">
              <img
                src={heroAvatarSrc}
                alt={heroAvatarAlt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <span className="text-[0.6rem] font-medium text-slate-100 max-w-[6rem] truncate">
              {heroName}
            </span>
          </div>

          <IconButton
            label="Open stats"
            onClick={onOpenStats}
            title="Stats"
            className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border border-rose-500/70 bg-slate-950/90 shadow-[0_0_16px_rgba(248,113,113,0.7)] hover:border-rose-400 hover:shadow-[0_0_22px_rgba(248,113,113,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <img
              src={UI_ART.STATS.src}
              alt={UI_ART.STATS.alt}
              className="w-5 h-5 md:w-6 md:h-6"
              draggable={false}
            />
          </IconButton>

          <IconButton
            label="Open settings"
            onClick={onOpenSettings}
            title="Settings"
            className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border border-sky-500/70 bg-slate-950/90 shadow-[0_0_16px_rgba(56,189,248,0.7)] hover:border-sky-400 hover:shadow-[0_0_22px_rgba(56,189,248,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <img
              src={UI_ART.GEAR.src}
              alt={UI_ART.GEAR.alt}
              className="w-5 h-5 md:w-6 md:h-6"
              draggable={false}
            />
          </IconButton>
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
