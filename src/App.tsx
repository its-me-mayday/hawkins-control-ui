import StrangerCard from "./components/StrangerCard";
import { HAWKINS_SYMBOLS, applyRoundToScoreboard, createInitialScoreboard, getRandomSymbol, judgeRound, type HawkinsSymbol, type RoundResult, type Scoreboard } from "@its-me-mayday/hawkins-control";
import "./index.css";
import GameArea from "./sections/GameArea";
import EnemyView from "./sections/EnemyView";
import BattleView from "./sections/BattleView";
import { useEffect, useRef, useState } from "react";
import { ART } from "./assets/art";

const STORAGE_KEY = "hawkins-control:v1";


function useButtonRipple(selector = ".hk-btn") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const onMove = (el: HTMLElement) => (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--rx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ry", `${e.clientY - r.top}px`);
    };
    const onEnter = (el: HTMLElement) => () => el.setPointerCapture?.((event as any)?.pointerId);
    const onLeave = (el: HTMLElement) => () => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };

    const binds = els.map((el) => {
      const m = onMove(el);
      const leave = onLeave(el);
      el.addEventListener("pointermove", m);
      el.addEventListener("pointerleave", leave);
      return { el, m, leave };
    });

    return () => {
      binds.forEach(({ el, m, leave }) => {
        el.removeEventListener("pointermove", m);
        el.removeEventListener("pointerleave", leave);
      });
    };
  }, [selector]);
}

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
  useButtonRipple();
  const [playerChoice, setPlayerChoice] = useState<HawkinsSymbol | null>(null);
  const [enemyChoice, setEnemyChoice] = useState<HawkinsSymbol | null>(null);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard>(createInitialScoreboard());
  const [targetWins, setTargetWins] = useState<number>(5); // first to N
  const [match, setMatch] = useState<{ player: number; enemy: number }>({ player: 0, enemy: 0 });
  const [celebrate, setCelebrate] = useState<boolean>(false);
  const [awaitNextRound, setAwaitNextRound] = useState(false); // lock dopo WIN/LOSE

  
  
  const synth = useSynth();

  const matchOver = match.player >= targetWins || match.enemy >= targetWins;
  const winnerText =
    match.player >= targetWins ? "YOU WON THE MATCH" :
    match.enemy >= targetWins ? "ENEMY WON THE MATCH" : null;

useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.targetWins) setTargetWins(parsed.targetWins);
      if (parsed?.match) setMatch(parsed.match);
      if (parsed?.scoreboard) setScoreboard(parsed.scoreboard);
    }
  } catch {}
}, []);

useEffect(() => {
  const payload = { targetWins, match, scoreboard };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
}, [targetWins, match, scoreboard]);


useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.targetWins) setTargetWins(parsed.targetWins);
      if (parsed?.match) setMatch(parsed.match);
      if (parsed?.scoreboard) setScoreboard(parsed.scoreboard);
    }
  } catch {}
}, []);

const resetRound = () => {
  setPlayerChoice(null);
  setEnemyChoice(null);
  setLastRound(null);
};

const resetMatch = () => {
  resetRound();
  setMatch({ player: 0, enemy: 0 });
  setScoreboard(createInitialScoreboard());
};


useEffect(() => {
  const payload = { targetWins, match, scoreboard };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
}, [targetWins, match, scoreboard]);

  
const onPick = (choice: HawkinsSymbol) => {
  if (matchOver || awaitNextRound) return; // blocca input se match finito o in attesa "New Round"
  synth.select();

  setPlayerChoice(choice);
  const enemy = getRandomSymbol();
  setEnemyChoice(enemy);

  const round = judgeRound(choice, enemy);
  setLastRound(round);
  setScoreboard((prev) => applyRoundToScoreboard(prev, round));

  setMatch((m) => {
    if (round.outcome === "PLAYER") return { ...m, player: m.player + 1 };
    if (round.outcome === "ENEMY")  return { ...m, enemy: m.enemy + 1 };
    return m;
  });

  if (round.outcome === "PLAYER") { synth.win(); setCelebrate(true); setAwaitNextRound(true); }
  else if (round.outcome === "ENEMY") { synth.lose(); setAwaitNextRound(true); }
  else { synth.draw(); setAwaitNextRound(false); } // DRAW: niente lock
};
  
const nextRound = () => {
  setAwaitNextRound(false);
  setCelebrate(false);
  setPlayerChoice(null);
  setEnemyChoice(null);
  setLastRound(null);
};;

  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-(--hawkins-muted) mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
      </header>

      <GameArea 
        variant="enemy" 
        title="Enemy" 
        subtitle={`Wins ${scoreboard.losses} • Losses ${scoreboard.wins} • Draws ${scoreboard.draws}`}>
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
<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
  <div className="text-xs uppercase tracking-widest text-[color:var(--hawkins-muted)]">
    First to{" "}
    <select
      className="bg-transparent border border-[color:var(--hawkins-muted)]/30 rounded px-2 py-1"
      value={targetWins}
      onChange={(e) => setTargetWins(Number(e.target.value))}
      disabled={matchOver}
    >
      {[3,5,7,10].map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  </div>

  <div className="flex gap-2">
    <button
      onClick={resetMatch}
      className="hk-btn hk-btn--danger"
      title="Reset match and scores"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2v10" />
        <path d="M7.5 4.2A9 9 0 1 0 16.5 4.2" />
      </svg>
      Reset Match
    </button>
  </div>
</div>

        {winnerText && (
          <div className="mt-2 text-sm hk-card text-center animate-hk-flash">
            {winnerText} — press “Reset Match” to play again
          </div>
        )}
        <BattleView
          narration={lastRound?.narration ?? null}
          result={lastRound?.outcome ?? null}
        />
      </GameArea>
      

      {awaitNextRound && !matchOver && (
  <div className="flex justify-end">
    <button
      onClick={nextRound}
      className="hk-btn hk-btn--ghost hk-btn--shine hk-btn--magnetic"
      title="Start a new round"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4l10 8-10 8V4z" />
        <path d="M19 5v14" />
      </svg>
      New Round
    </button>
  </div>
)}
      <GameArea variant="player" title="Player" subtitle="Choose your side">
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2 ${awaitNextRound || matchOver ? "opacity-60 pointer-events-none" : ""}`}>

          {HAWKINS_SYMBOLS.map((symbol) => (
            <StrangerCard 
              key={symbol} 
              label={symbol} 
              selected={playerChoice === symbol}
              outcomeForSelected={playerChoice === symbol ? (lastRound?.outcome ?? null) : null}
              imageSrc={ART[symbol].src}
              imageWinSrc={ART[symbol].win}
              imageLoseSrc={ART[symbol].lose}
              imageAlt={ART[symbol].alt}
              onSelect={() => onPick(symbol)}
              imageFit={ART[symbol].fit}
              imagePosition={ART[symbol].pos}
              useWinImage={
                awaitNextRound && playerChoice === symbol && lastRound?.outcome === "PLAYER"
              }
              useLoseImage={
                awaitNextRound && playerChoice === symbol && lastRound?.outcome === "ENEMY"
              }
              aspect={ART[symbol].aspect}
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