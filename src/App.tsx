import StrangerCard from "./components/StrangerCard";
import { HAWKINS_SYMBOLS, applyRoundToScoreboard, createInitialScoreboard, getRandomSymbol, judgeRound, type HawkinsSymbol, type RoundResult, type Scoreboard } from "@its-me-mayday/hawkins-control";
import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import { useRef, useState } from "react";

function useSynth() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensureCtx = () => (ctxRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)());

  const tone = (freq: number, dur = 0.15, type: OscillatorType = "sine", gain = 0.06) => {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + dur);
  };

  const click = () => tone(2200, 0.05, "square", 0.03);
  const win = () => { tone(880, 0.12, "sawtooth", 0.06); setTimeout(() => tone(1320, 0.12, "sawtooth", 0.05), 90); };
  const lose = () => tone(220, 0.18, "triangle", 0.07);
  const draw = () => tone(600, 0.1, "sine", 0.04);

  return { click, win, lose, draw };
}

export default function App() {
  const synth = useSynth();
  const [playerChoice, setPlayerChoice] = useState<HawkinsSymbol | null>(null);
  const [enemyChoice, setEnemyChoice] = useState<HawkinsSymbol | null>(null);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard>(createInitialScoreboard());
  
  const onPick = (choice: HawkinsSymbol) => {
    requestAnimationFrame(() => {
      const btn = document.activeElement as HTMLElement | null;
      if (btn) { btn.classList.add("animate-hk-press"); setTimeout(() => btn.classList.remove("animate-hk-press"), 160); }
    });
    
    synth.click();
    
    setPlayerChoice(choice);
    const enemy = getRandomSymbol();
    setEnemyChoice(enemy);
    const round = judgeRound(choice, enemy);
    setLastRound(round);
    setScoreboard((prev) => applyRoundToScoreboard(prev, round));
    
    if (round.outcome === "PLAYER") synth.win();
    else if (round.outcome === "ENEMY") synth.lose();
    else synth.draw();
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
