import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import StrangerCard from "./components/StrangerCard";
import ControlsBar from "./components/ControlsBar";
import { ART, UI_ART } from "./assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { useGameController } from "./hooks/useGameController";
import IconButton from "./components/IconButton";
import SettingsDialog from "./components/SettingsDialog";
import StatsPanel from "./components/StatsPanel";
import MatchSetupPanel from "./components/MatchSetupPanel";
import { useState } from "react";

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
    },
    actions: { setTargetWins, onPick, nextRound, resetMatch },
  } = useGameController();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const startMatch = (rounds: number) => {
    resetMatch();
    setTargetWins(rounds);
    setStarted(true);
  };

  const disablePlay = !started || awaitNextRound || matchOver;

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8 relative pr-16 sm:pr-24">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-[color:var(--hawkins-muted)] mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>

        <div className="absolute right-0 top-0">
          <IconButton label="Open settings" onClick={() => setSettingsOpen(true)}>
            <img
              src={UI_ART.GEAR.src}
              alt={UI_ART.GEAR.alt}
              className="w-8 h-8 md:w-10 md:h-10"
              draggable={false}
            />
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
          <GameArea
            variant="enemy"
            title="Enemy"
            subtitle={started ? "The computer is plotting..." : "Waiting for match to start"}
          >
            <EnemyView choice={started ? (enemyChoice ?? null) : null} />
          </GameArea>

          <GameArea
  variant="battle"
  title="Battle"
  subtitle={started ? "Fate is decided in the neon flicker." : "Set rounds and start the match."}
  className={
    lastRound?.outcome === "PLAYER"
      ? "animate-hk-win"
      : lastRound?.outcome === "ENEMY"
      ? "animate-hk-lose"
      : lastRound?.outcome === "DRAW"
      ? "animate-hk-draw"
      : ""
  }
>
  <ControlsBar
    targetWins={targetWins}
    disabledSelect={true}
    onChangeTarget={setTargetWins}
    showTarget={false}
  />

  {winnerText ? (
    <div className="mt-2 hk-card text-center space-y-3 animate-hk-flash">
      <div className="text-sm">{winnerText}</div>
      <button
        className="hk-btn hk-btn--danger"
        onClick={() => {
          resetMatch();
          setStarted(false);
        }}
      >
        New Match
      </button>
    </div>
  ) : null}

  <BattleView
    narration={started ? (lastRound?.narration ?? null) : null}
    result={started ? (lastRound?.outcome ?? null) : null}
  />
</GameArea>


          <GameArea variant="player" title="Player" subtitle={started ? "Choose your side" : "Start the match"}>
            <div className="relative">
              {!started && (
                <div className="absolute inset-0 grid place-items-center z-10">
                  <div className="hk-card text-sm text-center">
                    Select rounds and press <strong>Start</strong> to play.
                  </div>
                </div>
              )}

              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2 ${
                  disablePlay ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {HAWKINS_SYMBOLS.map((symbol: HawkinsSymbol) => (
                  <StrangerCard
                    key={symbol}
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
                    onSelect={() => onPick(symbol)}
                  />
                ))}
              </div>
            </div>
          </GameArea>
        </div>

        {/* COLONNA DESTRA */}
        <div className="space-y-6 mt-6 lg:mt-0">
          <MatchSetupPanel
            onStart={startMatch}
            defaultTarget={targetWins}
            disabled={started && !matchOver}
          />
          <StatsPanel
            wins={scoreboard.wins}
            losses={scoreboard.losses}
            draws={scoreboard.draws}
            playerScore={match.player}
            enemyScore={match.enemy}
          />
        </div>
      </div>
    </main>
  );
}
