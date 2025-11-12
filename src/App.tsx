import StrangerCard from "./components/StrangerCard";
import { HAWKINS_SYMBOLS, applyRoundToScoreboard, createInitialScoreboard, getRandomSymbol, judgeRound, type HawkinsSymbol, type RoundResult, type Scoreboard } from "@its-me-mayday/hawkins-control";
import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import { useRef, useState } from "react";

function useSynth() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensureCtx = () =>
    (ctxRef.current ??= new (window.AudioContext ||
      (window as any).webkitAudioContext)());

  const now = () => ensureCtx().currentTime;

  const mkGain = (v = 0.1) => {
    const ctx = ensureCtx();
    const g = ctx.createGain();
    g.gain.value = v;
    return g;
  };

  const mkBiquad = (type: BiquadFilterType, freq: number, q = 0.0001) => {
    const ctx = ensureCtx();
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  };

  const connect = (...nodes: AudioNode[]) => {
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
    return nodes[nodes.length - 1];
  };

  const select = () => {
    const ctx = ensureCtx();
    const t0 = now();

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = "sawtooth";
    o2.type = "sawtooth";

    o1.frequency.setValueAtTime(260, t0);
    o1.frequency.exponentialRampToValueAtTime(420, t0 + 0.12);
    o2.frequency.setValueAtTime(260 * 0.997, t0); // slight detune
    o2.frequency.exponentialRampToValueAtTime(420 * 1.003, t0 + 0.12);

    const bp = mkBiquad("bandpass", 900, 10);
    bp.frequency.setValueAtTime(600, t0);
    bp.frequency.exponentialRampToValueAtTime(1400, t0 + 0.12);

    const g = mkGain(0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.22);

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.11;
    const fb = mkGain(0.18);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const nbp = mkBiquad("bandpass", 1200, 6);
    const ng = mkGain(0.05);
    ng.gain.setValueAtTime(0.0001, t0);
    ng.gain.exponentialRampToValueAtTime(0.05, t0 + 0.02);
    ng.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.18);

    const mix = mkGain(1.0);
    connect(delay, fb, delay);
    connect(o1, bp);
    connect(o2, bp);
    connect(bp, g, mix);
    connect(noise, nbp, ng, mix);
    connect(mix, delay, ctx.destination);
    mix.connect(ctx.destination);

    noise.start(t0);
    o1.start(t0);
    o2.start(t0);
    noise.stop(t0 + 0.22);
    o1.stop(t0 + 0.24);
    o2.stop(t0 + 0.24);
  };

  const win = () => {
    const ctx = ensureCtx();
    const t0 = now();
    const o = ctx.createOscillator();
    const g = mkGain(0.07);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(440, t0);
    o.frequency.exponentialRampToValueAtTime(660, t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.23, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.24);
    connect(o, g, ensureCtx().destination);
    o.start(t0);
    o.stop(t0 + 0.26);
  };

  const lose = () => {
    const ctx = ensureCtx();
    const t0 = now();
    const o = ctx.createOscillator();
    const g = mkGain(0.08);
    o.type = "triangle";
    o.frequency.setValueAtTime(240, t0);
    o.frequency.exponentialRampToValueAtTime(180, t0 + 0.18);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.28, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.22);
    connect(o, g, ensureCtx().destination);
    o.start(t0);
    o.stop(t0 + 0.24);
  };

  const draw = () => {
    const ctx = ensureCtx();
    const t0 = now();
    const o = ctx.createOscillator();
    const g = mkGain(0.05);
    const f = mkBiquad("bandpass", 900, 6);
    o.type = "sine";
    o.frequency.setValueAtTime(620, t0);
    o.frequency.exponentialRampToValueAtTime(720, t0 + 0.1);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.16);
    connect(o, f, g, ensureCtx().destination);
    o.start(t0);
    o.stop(t0 + 0.18);
  };

  return { select, win, lose, draw };
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
    
    synth.select();
    
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
