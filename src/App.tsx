import "./index.css";
import { useEffect, useMemo, useState } from "react";
import StartScreen from "./components/StartScreen";
import { HEROES, UI_ART } from "./assets/art";
import { HERO_META, type HeroKey } from "./constants/heroes";
import { useGameController } from "./hooks/useGameController";
import { useSynth } from "./hooks/useSynth";
import { useAmbience } from "./hooks/useAmbience";
import AppHeader from "./layout/AppHeader";
import GameScreen from "./layout/GameScreen";

const STORAGE_SETTINGS_KEY = "hawkins-control:audio";

function readAudioSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.schemaVersion === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function writeAudioSettings(s: unknown) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(s));
  } catch {
  }
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
    setMusicOn(!!(s as any).musicOn);
    setSfxOn(!!(s as any).sfxOn);
    setMusicVolume(
      typeof (s as any).musicVolume === "number" ? (s as any).musicVolume : 0.12,
    );
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
    if (started && !matchOver && !playerChoice && !enemyChoice) {
      setBattleShown(false);
    }
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

  const handleSelectCard = (symbol: any) => {
    if (!battleShown) setBattleShown(true);
    if (sfxOn) {
      try {
        synth.arm();
      } catch {
      }
      synth.select();
    }
    onPick(symbol);
  };

  const handleNewMatch = () => {
    resetMatch();
    setStarted(false);
    setBattleShown(false);
  };

  const handleGoHome = () => {
    resetMatch();
    setStarted(false);
    setBattleShown(false);
    setShowHome(true);
  };

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
        <AppHeader
          targetWins={targetWins}
          heroId={hero}
          heroName={heroMeta.name}
          heroAvatarSrc={heroArt.src}
          heroAvatarAlt={heroArt.alt}
          heroJustChanged={heroJustChanged}
          onOpenStats={() => setStatsOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onGoHome={handleGoHome}
          onNewMatch={handleNewMatch}
        />

        <GameScreen
          matchPlayer={match.player}
          matchEnemy={match.enemy}
          targetWins={targetWins}
          settingsOpen={settingsOpen}
          statsOpen={statsOpen}
          onCloseSettings={() => setSettingsOpen(false)}
          onCloseStats={() => setStatsOpen(false)}
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
          wins={scoreboard.wins}
          losses={scoreboard.losses}
          draws={scoreboard.draws}
          started={started}
          playerFolded={playerFolded}
          disablePlay={disablePlay}
          battleShown={battleShown}
          battleAnim={battleAnim}
          playerChoice={playerChoice}
          enemyChoice={enemyChoice}
          lastOutcome={lastRound?.outcome ?? null}
          lastNarration={lastRound?.narration ?? null}
          awaitNextRound={awaitNextRound}
          enemyThinking={enemyThinking}
          enemyProgress={enemyProgress}
          onSelectCard={handleSelectCard}
          startOverlayOpen={!started}
          startOverlayDefaultTarget={targetWins}
          hero={hero}
          onChangeHero={setHero}
          onStartMatch={startMatch}
          endOverlayOpen={matchOver}
          winnerText={winnerText}
          matchResult={matchResult}
          heroName={heroMeta.name}
          heroId={hero}
          onNewMatch={handleNewMatch}
        />
      </div>
    </div>
  );
}
