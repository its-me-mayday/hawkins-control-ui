import "./index.css";
import GameArea from "./sections/GameArea";
import StrangerCard from "./components/StrangerCard";
import ControlsBar from "./components/ControlsBar";
import { ART, UI_ART } from "./assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { useGameController } from "./hooks/useGameController";
import IconButton from "./components/IconButton";
import SettingsDialog from "./components/SettingsDialog";
import StatsPanel from "./components/StatsPanel";
import BattleDuel from "./components/BattleDuel";
import StartOverlay from "./components/StartOverlay";
import EndOverlay from "./components/EndOverlay";
import { useEffect, useMemo, useState } from "react";
import { useSynth } from "./hooks/useSynth";
import { useAmbience } from "./hooks/useAmbience";

const STORAGE_SETTINGS_KEY = "hawkins-control:audio";

type AudioSettingsV1 = {
  schemaVersion: 1;
  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number; // 0..1
};

function readAudioSettings(): AudioSettingsV1 | null {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.schemaVersion === 1) return parsed as AudioSettingsV1;
    }
    const legMusicOn = localStorage.getItem("hawkins:musicOn");
    const legSfxOn = localStorage.getItem("hawkins:sfxOn");
    const legVol = localStorage.getItem("hawkins:musicVolume");
    if (legMusicOn || legSfxOn || legVol) {
      return {
        schemaVersion: 1,
        musicOn: legMusicOn ? legMusicOn === "true" : false,
        sfxOn: legSfxOn ? legSfxOn === "true" : true,
        musicVolume: legVol ? Math.max(0, Math.min(1, Number(legVol))) : 0.12,
      };
    }
  } catch {}
  return null;
}

function writeAudioSettings(s: AudioSettingsV1) {
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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [battleShown, setBattleShown] = useState(false);

  const synth = useSynth();
  const ambience = useAmbience();

  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [musicVolume, setMusicVolume] = useState<number>(0.12);

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
    if (!out) return;
    if (!sfxOn) return;
    if (out === "PLAYER") synth.win();
    else if (out === "ENEMY") synth.lose();
    else synth.draw();
  }, [lastRound?.outcome, sfxOn]);

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8 relative pr-16 sm:pr-24">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-(--hawkins-muted) mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
        <div className="absolute right-0 top-0">
          <IconButton label="Open settings" onClick={() => setSettingsOpen(true)}>
            <img src={UI_ART.GEAR.src} alt={UI_ART.GEAR.alt} className="w-8 h-8 md:w-10 md:h-10" draggable={false} />
          </IconButton>
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
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <div className={playerFolded ? "hk-fold hk-fold--collapsed" : "hk-fold hk-fold--open"}>
            <GameArea variant="player" title="Player" subtitle={started ? "Choose your side" : "Start the match"}>
              <div className="relative">
                <div className={`grid grid-cols-3 gap-5 mt-2 ${disablePlay ? "opacity-60 pointer-events-none" : ""}`}>
                  {HAWKINS_SYMBOLS.map((symbol: HawkinsSymbol) => (
                    <div key={symbol} className="flex justify-center">
                      <StrangerCard
                        label={symbol}
                        selected={playerChoice === symbol}
                        outcomeForSelected={playerChoice === symbol ? (lastRound?.outcome ?? null) : null}
                        imageSrc={ART[symbol].src}
                        imageWinSrc={ART[symbol].win}
                        imageLoseSrc={ART[symbol].lose}
                        imageAlt={ART[symbol].alt}
                        imageFit={ART[symbol].fit}
                        imagePosition={ART[symbol].pos}
                        useWinImage={awaitNextRound && playerChoice === symbol && lastRound?.outcome === "PLAYER"}
                        useLoseImage={awaitNextRound && playerChoice === symbol && lastRound?.outcome === "ENEMY"}
                        aspect={ART[symbol].aspect}
                        onSelect={() => {
                          if (!battleShown) setBattleShown(true);
                          if (sfxOn) {
                            try { synth.arm(); } catch {}
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
              subtitle={started ? "Fate is decided in the neon flicker." : "Set rounds and start the match."}
              className={battleAnim}
            >
              <ControlsBar targetWins={targetWins} disabledSelect={true} onChangeTarget={setTargetWins} showTarget={false} />
              <BattleDuel
                player={started ? playerChoice : null}
                enemy={started ? enemyChoice : null}
                outcome={started ? (lastRound?.outcome ?? null) : null}
                narration={started ? (lastRound?.narration ?? null) : null}
                locked={awaitNextRound}
                thinking={started && enemyThinking}
                progress={enemyProgress}
              />
            </GameArea>
          )}
        </div>

        <div className="space-y-6 mt-6 lg:mt-0">
          <StatsPanel
            wins={scoreboard.wins}
            losses={scoreboard.losses}
            draws={scoreboard.draws}
            playerScore={match.player}
            enemyScore={match.enemy}
          />
        </div>
      </div>

      <StartOverlay open={!started} defaultTarget={targetWins} onStart={startMatch} />
      <EndOverlay
        open={matchOver}
        winnerText={winnerText}
        onNewMatch={() => {
          resetMatch();
          setStarted(false);
          setBattleShown(false);
        }}
      />
    </main>
  );
}
