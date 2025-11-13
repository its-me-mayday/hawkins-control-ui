import "./index.css";
import { UI_ART, HEROES } from "./assets/art";
import StartScreen from "./components/StartScreen";
import { useGameController } from "./hooks/useGameController";
import { useEffect, useMemo, useState } from "react";
import { useSynth } from "./hooks/useSynth";
import { useAmbience } from "./hooks/useAmbience";
import { HERO_META, type HeroKey } from "./constants/heroes";
import { readAudioSettings, writeAudioSettings } from "./utils/audioSettings";
import AppHeader from "./layout/AppHeader";
import GameScreen from "./layout/GameScreen";

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
    const settings = readAudioSettings();
    if (!settings) return;
    setMusicOn(settings.musicOn);
    setSfxOn(settings.sfxOn);
    setMusicVolume(settings.musicVolume);
  }, []);

  useEffect(() => {
    writeAudioSettings({
      schemaVersion: 1,
      musicOn,
      sfxOn,
      musicVolume,
    });
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
        <AppHeader
          targetWins={targetWins}
          heroId={hero}
          heroName={heroMeta.name}
          heroAvatarSrc={heroArt.src}
          heroAvatarAlt={heroArt.alt}
          heroJustChanged={heroJustChanged}
          onOpenStats={() => setStatsOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
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
          onToggleMusic={(value) => {
            setMusicOn(value);
            if (value) ambience.arm();
          }}
          onToggleSfx={(value) => {
            setSfxOn(value);
            if (value) synth.arm();
          }}
          onChangeMusicVolume={(value) => setMusicVolume(value)}
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
          lastOutcome={lastRound?.outcome}
          lastNarration={lastRound?.narration}
          awaitNextRound={awaitNextRound}
          enemyThinking={enemyThinking}
          enemyProgress={enemyProgress}
          onSelectCard={(symbol) => {
            if (!battleShown) setBattleShown(true);
            if (sfxOn) {
              try {
                synth.arm();
              } catch {}
              synth.select();
            }
            onPick(symbol);
          }}
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
          onNewMatch={() => {
            resetMatch();
            setStarted(false);
            setBattleShown(false);
          }}
        />
      </div>
    </div>
  );
}
