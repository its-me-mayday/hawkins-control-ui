import "./index.css";
import GameArea from "./sections/GameArea";
import BattleView from "./sections/BattleView";
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

  const disablePlay = !started || awaitNextRound || matchOver;
  const playerFolded =
    started &&
    (enemyThinking || awaitNextRound || matchOver) &&
    playerChoice !== null;

  const battleAnim = useMemo(() => {
    if (lastRound?.outcome === "PLAYER") return "animate-hk-win";
    if (lastRound?.outcome === "ENEMY") return "animate-hk-lose";
    if (lastRound?.outcome === "DRAW") return "animate-hk-draw";
    return "";
  }, [lastRound?.outcome]);

  const startMatch = (rounds: number) => {
    synth.arm();
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
    if (out === "PLAYER") synth.win();
    else if (out === "ENEMY") synth.lose();
    else synth.draw();
  }, [lastRound?.outcome]);

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8 relative pr-16 sm:pr-24">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-[color:var(--hawkins-muted)] mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
        <div className="absolute right-0 top-0">
          <IconButton label="Open settings" onClick={() => setSettingsOpen(true)}>
            <img src={UI_ART.GEAR.src} alt={UI_ART.GEAR.alt} className="w-8 h-8 md:w-10 md:h-10" draggable={false} />
          </IconButton>
        </div>
        <SettingsDialog
          open={settingsOpen}
          targetWins={targetWins}
          onChangeTarget={setTargetWins}
          onClose={() => setSettingsOpen(false)}
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
                locked={awaitNextRound}
                thinking={started && enemyThinking}
                progress={enemyProgress}
              />
              <div className="mt-4">
                <BattleView
                  narration={started ? (lastRound?.narration ?? null) : null}
                  result={started ? (lastRound?.outcome ?? null) : null}
                />
              </div>
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
