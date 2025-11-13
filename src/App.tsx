import "./index.css";
import GameArea from "./sections/GameArea";
import StrangerCard from "./components/StrangerCard";
import { ART, UI_ART, HEROES } from "./assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { useGameController } from "./hooks/useGameController";
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
import { HERO_META, type HeroKey } from "./constants/heroes";
import { readAudioSettings, writeAudioSettings } from "./utils/audioSettings";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";

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
          heroName={heroMeta.name}
          heroAvatarSrc={heroArt.src}
          heroAvatarAlt={heroArt.alt}
          heroJustChanged={heroJustChanged}
          onOpenStats={() => setStatsOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

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

          <AppFooter />

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
