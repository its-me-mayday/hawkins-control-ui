import StrangerCard from "./components/StrangerCard";
import { HAWKINS_SYMBOLS, applyRoundToScoreboard, createInitialScoreboard, getRandomSymbol, judgeRound, type HawkinsSymbol, type RoundResult, type Scoreboard } from "@its-me-mayday/hawkins-control";
import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import { useState } from "react";

export default function App() {
  const [playerChoice, setPlayerChoice] = useState<HawkinsSymbol | null>(null);
  const [enemyChoice, setEnemyChoice] = useState<HawkinsSymbol | null>(null);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard>(createInitialScoreboard());
  
  const onPick = (choice: HawkinsSymbol) => {
    requestAnimationFrame(() => {
      const btn = document.activeElement as HTMLElement | null;
      if (btn) { btn.classList.add("animate-hk-press"); setTimeout(() => btn.classList.remove("animate-hk-press"), 160); }
    });
    
    setPlayerChoice(choice);
    const enemy = getRandomSymbol();
    setEnemyChoice(enemy);
    const round = judgeRound(choice, enemy);
    setLastRound(round);
    setScoreboard((prev) => applyRoundToScoreboard(prev, round));
  };

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-(--hawkins-muted) mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
      </header>

      <GameArea variant="enemy" title="Enemy" subtitle={`Wins ${scoreboard.losses} • Losses ${scoreboard.wins} • Draws ${scoreboard.draws}`}>
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
        <BattleView
          narration={lastRound?.narration ?? null}
          result={lastRound?.outcome ?? null}
        />
      </GameArea>

      <GameArea variant="player" title="Player" subtitle="Choose your side">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2 p-2">
          {HAWKINS_SYMBOLS.map((symbol) => (
            <StrangerCard 
              key={symbol} 
              label={symbol} 
              selected={playerChoice === symbol}
              outcomeForSelected={playerChoice === symbol ? (lastRound?.outcome ?? null) : null}
              onSelect={() => onPick(symbol)}
            />
          ))}
        </div>
      </GameArea>
    </main>
  );
}
