import "./index.css";
import GameArea from "./sections/GameArea";
import StrangerCard from "./components/StrangerCard";
import { ART, UI_ART, HEROES } from "./assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { useGameController } from "./hooks/useGameController";
import IconButton from "./components/IconButton";
import SettingsDialog from "./components/SettingsDialog";
import BattleDuel from "./components/BattleDuel";
import StartOverlay from "./components/StartOverlay";
import EndOverlay from "./components/EndOverlay";
import StatsDialog from "./components/StatsDialog";
import MatchBadge from "./components/MatchBadge";
import StartScreen from "./components/StartScreen";
import { useEffect, useMemo, useState } from "react";
import { useSynth } from "./hooks/useSynth";
import { useAmbience } from "./hooks/useAmbience";

const STORAGE_SETTINGS_KEY = "hawkins-control:audio";

type HeroKey = keyof typeof HEROES;

const HERO_META: Record<HeroKey, { name: string; role: string }> = {
  DUSTIN: {
    name: "Dustin Henderson",
    role: "Brains of the Party",
  },
  HOPPER: {
    name: "Jim Hopper",
    role: "Hawkins Chief",
  },
  MIKE: {
    name: "Mike Wheeler",
    role: "Party Leader",
  },
};

function readAudioSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.schemaVersion === 1 ? parsed : null;
  } catch {}
  return null;
}

function writeAudioSettings(s: any) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

export default function App() {
  const {
    state: {
      playerChoice,
      enemyChoice,
      lastRound,
      scoreboard,
      targetWins,
      match,
      awaitNextRound,
      matchOver,
      winnerText,
      enemyThinking,
      enemyProgress,
    },
    actions: { setTargetWins, onPick, resetMatch },
  } = useGameController();

  const [showHome, setShowHome] = useState(true);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [battleShown, setBattleShown] = useState(false);

  const [hero, setHero] = useState<HeroKey>("DUSTIN");
  const [heroJustChanged, setHeroJustChanged] = useState(false);

  const synth = useSynth();
  const ambience = useAmbience();

  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.12);

  useEffect(() => {
    ambience.setMode?.("pulse");
  }, [ambience]);

  useEffect(() => {
    const s = readAudioSettings();
    if (!s) return;
    setMusicOn(!!s.musicOn);
    setSfxOn(!!s.sfxOn);
    setMusicVolume(typeof s.musicVolume === "number" ? s.musicVolume : 0.12);
  }, []);

  useEffect(() => {
    writeAudioSettings({ schemaVersion: 1, musicOn, sfxOn, musicVolume });
  }, [musicOn, sfxOn, musicVolume]);

  useEffect(() => {
    ambience.setEnabled(musicOn);
  }, [musicOn, ambience]);

  useEffect(() => {
    ambience.setVolume(musicVolume);
  }, [musicVolume, ambience]);

  useEffect(() => {
    setHeroJustChanged(true);
    const t = setTimeout(() => setHeroJustChanged(false), 700);
    return () => clearTimeout(t);
  }, [hero]);

  const disablePlay = !started || awaitNextRound || matchOver;
  const playerFolded =
    started && (enemyThinking || awaitNextRound || matchOver) && playerChoice !== null;

  const battleAnim = useMemo(() => {
    if (lastRound?.outcome === "PLAYER") return "animate-hk-win";
    if (lastRound?.outcome === "ENEMY") return "animate-hk-lose";
    if (lastRound?.outcome === "DRAW") return "animate-hk-draw";
    return "";
  }, [lastRound?.outcome]);

  const startMatch = (rounds: number) => {
    if (musicOn) ambience.arm();
    if (sfxOn) synth.arm();
    resetMatch();
    setTargetWins(rounds);
    setStarted(true);
    setBattleShown(false);
  };

  useEffect(() => {
    if (started && !matchOver && !playerChoice && !enemyChoice) setBattleShown(false);
  }, [started, matchOver, playerChoice, enemyChoice]);

  useEffect(() => {
    const out = lastRound?.outcome;
    if (!out || !sfxOn) return;
    if (out === "PLAYER") synth.win();
    else if (out === "ENEMY") synth.lose();
    else synth.draw();
  }, [lastRound?.outcome, sfxOn, synth]);

  const heroMeta = HERO_META[hero];
  const heroArt = HEROES[hero];

  const matchResult =
    !matchOver
      ? null
      : match.player > match.enemy
      ? "PLAYER"
      : match.player < match.enemy
      ? "ENEMY"
      : "DRAW";

  if (showHome) {
    return (
      <StartScreen
        onEnter={() => setShowHome(false)}
        logoSrc={UI_ART.ICON.src}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[radial-gradient(circle_at_top,_#f97316_0,_transparent_55%),radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
      <div className="relative flex min-h-screen flex-col">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex flex-col gap-0.5">
                <h1 className="text-lg sm:text-xl font-semibold tracking-[0.3em] uppercase truncate">
                  Hawkins Control
                </h1>
                <p className="hidden text-[0.7rem] uppercase tracking-[0.2em] text-slate-400 sm:block">
                  Season 1 · First to {targetWins} wins
                </p>
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
                    src={heroArt.src}
                    alt={heroArt.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] text-slate-500">
                    You
                  </span>
                  <span className="text-[0.7rem] font-semibold text-slate-100 truncate max-w-[7rem]">
                    {heroMeta.name}
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
                    src={heroArt.src}
                    alt={heroArt.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <span className="text-[0.6rem] font-medium text-slate-100 max-w-[6rem] truncate">
                  {heroMeta.name}
                </span>
              </div>

              <IconButton
                label="Open stats"
                onClick={() => setStatsOpen(true)}
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
                onClick={() => setSettingsOpen(true)}
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

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-center">
            <MatchBadge player={match.player} enemy={match.enemy} targetWins={targetWins} />
          </div>

          <SettingsDialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            musicOn={musicOn}
            sfxOn={sfxOn}
            musicVolume={musicVolume}
            onToggleMusic={(v) => {
              setMusicOn(v);
              if (v) ambience.arm();
            }}
            onToggleSfx={(v) => {
              setSfxOn(v);
              if (v) synth.arm();
            }}
            onChangeMusicVolume={(v) => setMusicVolume(v)}
          />

          <StatsDialog
            open={statsOpen}
            onClose={() => setStatsOpen(false)}
            wins={scoreboard.wins}
            losses={scoreboard.losses}
            draws={scoreboard.draws}
            playerScore={match.player}
            enemyScore={match.enemy}
            heroName={heroMeta.name}
          />

          <div className="flex-1">
            <div className="space-y-6 min-w-0">
              <div
                className={
                  playerFolded ? "hk-fold hk-fold--collapsed" : "hk-fold hk-fold--open"
                }
              >
                <GameArea
                  variant="player"
                  title="Player"
                  subtitle={started ? "Choose your side" : "Tune the experiment and start"}
                >
                  <div className="relative">
                    <div
                      className={`grid grid-cols-3 gap-5 mt-2 ${
                        disablePlay ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {HAWKINS_SYMBOLS.map((symbol: HawkinsSymbol) => (
                        <div key={symbol} className="flex justify-center">
                          <StrangerCard
                            label={symbol}
                            selected={playerChoice === symbol}
                            outcomeForSelected={
                              playerChoice === symbol ? lastRound?.outcome ?? null : null
                            }
                            imageSrc={ART[symbol].src}
                            imageWinSrc={ART[symbol].win ?? ART[symbol].src}
                            imageLoseSrc={ART[symbol].lose ?? ART[symbol].src}
                            imageAlt={ART[symbol].alt}
                            imageFit={ART[symbol].fit}
                            imagePosition={ART[symbol].pos}
                            useWinImage={
                              awaitNextRound &&
                              playerChoice === symbol &&
                              lastRound?.outcome === "PLAYER"
                            }
                            useLoseImage={
                              awaitNextRound &&
                              playerChoice === symbol &&
                              lastRound?.outcome === "ENEMY"
                            }
                            aspect={ART[symbol].aspect}
                            onSelect={() => {
                              if (!battleShown) setBattleShown(true);
                              if (sfxOn) {
                                try {
                                  synth.arm();
                                } catch {}
                                synth.select();
                              }
                              onPick(symbol);
                            }}
                            className="max-w-[150px] sm:max-w-[170px] lg:max-w-[190px]"
                            titleSize="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </GameArea>
              </div>

              {battleShown && (
                <GameArea
                  variant="battle"
                  title="Battle"
                  subtitle={
                    started
                      ? "Cards clash under Hawkins neon."
                      : "Set rounds and start the experiment."
                  }
                  className={battleAnim}
                >
                  <BattleDuel
                    player={started ? playerChoice : null}
                    enemy={started ? enemyChoice : null}
                    outcome={started ? lastRound?.outcome ?? null : null}
                    narration={started ? lastRound?.narration ?? null : null}
                    locked={awaitNextRound}
                    thinking={started && enemyThinking}
                    progress={enemyProgress}
                  />
                </GameArea>
              )}
            </div>
          </div>

          <footer className="mt-2 border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[0.7rem] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-[0.18em] text-slate-500">
                S1 rule
              </span>
              <span>
                Eleven beats Demogorgon, Demogorgon beats Hawkins Lab, Hawkins Lab beats Eleven.
              </span>
            </div>
            <span className="uppercase tracking-[0.16em] text-slate-500">
              Hawkins Control · Season 1
            </span>
          </footer>

          <StartOverlay
            open={!started}
            defaultTarget={targetWins}
            hero={hero}
            onChangeHero={setHero}
            onStart={startMatch}
          />
          <EndOverlay
            open={matchOver}
            winnerText={winnerText}
            result={matchResult}
            heroId={hero}
            heroName={heroMeta.name}
            onNewMatch={() => {
              resetMatch();
              setStarted(false);
              setBattleShown(false);
            }}
          />
        </main>
      </div>
    </div>
  );
}
