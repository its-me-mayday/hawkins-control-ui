import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import StrangerCard from "./components/StrangerCard";
import ControlsBar from "./components/ControlsBar";
import NewRoundBar from "./components/NewRoundBar";
import { ART } from "./assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import { useGameController } from "./hooks/useGameController";

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

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-(--hawkins-muted) mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
      </header>

      <GameArea
        variant="enemy"
        title="Enemy"
        subtitle={`Wins ${scoreboard.losses} • Losses ${scoreboard.wins} • Draws ${scoreboard.draws}`}
      >
        <EnemyView choice={enemyChoice ?? null} />
      </GameArea>

      <GameArea
        variant="battle"
        title="Battle"
        subtitle="Fate is decided in the neon flicker."
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
          disabledSelect={matchOver || awaitNextRound}
          onChangeTarget={setTargetWins}
          onResetMatch={resetMatch}
        />

        {winnerText && (
          <div className="mt-2 text-sm hk-card text-center animate-hk-flash">
            {winnerText} — press “Reset Match” to play again
          </div>
        )}

        <BattleView narration={lastRound?.narration ?? null} result={lastRound?.outcome ?? null} />
      </GameArea>

      <NewRoundBar visible={awaitNextRound && !matchOver} onNext={nextRound} />

      <GameArea variant="player" title="Player" subtitle="Choose your side">
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2 ${
            awaitNextRound || matchOver ? "opacity-60 pointer-events-none" : ""
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

        <div className="mt-3 text-xs text-(--hawkins-muted) uppercase tracking-widest">
          Match: You {match.player} — {match.enemy} Enemy
        </div>
      </GameArea>
    </main>
  );
}