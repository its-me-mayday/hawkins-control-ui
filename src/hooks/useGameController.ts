// src/hooks/useGameController.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyRoundToScoreboard,
  createInitialScoreboard,
  getRandomSymbol,
  judgeRound,
  type HawkinsSymbol,
  type RoundResult,
  type Scoreboard,
} from "@its-me-mayday/hawkins-control";
import { useSynth } from "./useSynth";

export function useGameController(storageKey = "hawkins-control:v1") {
  const [playerChoice, setPlayerChoice] = useState<HawkinsSymbol | null>(null);
  const [enemyChoice, setEnemyChoice] = useState<HawkinsSymbol | null>(null);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard>(createInitialScoreboard());
  const [targetWins, setTargetWins] = useState<number>(5);
  const [match, setMatch] = useState<{ player: number; enemy: number }>({ player: 0, enemy: 0 });
  const [awaitNextRound, setAwaitNextRound] = useState(false);

  // NEW: enemy thinking state
  const [enemyThinking, setEnemyThinking] = useState(false);
  const [enemyProgress, setEnemyProgress] = useState(0);

  // timers refs
  const thinkTimeoutRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const synth = useSynth();

  const matchOver = useMemo(
    () => match.player >= targetWins || match.enemy >= targetWins,
    [match, targetWins]
  );

  const winnerText = useMemo(
    () =>
      match.player >= targetWins
        ? "YOU WON THE MATCH"
        : match.enemy >= targetWins
        ? "ENEMY WON THE MATCH"
        : null,
    [match, targetWins]
  );

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.targetWins) setTargetWins(parsed.targetWins);
      if (parsed?.match) setMatch(parsed.match);
      if (parsed?.scoreboard) setScoreboard(parsed.scoreboard);
    } catch {}
  }, [storageKey]);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ targetWins, match, scoreboard })
      );
    } catch {}
  }, [storageKey, targetWins, match, scoreboard]);

  const clearThinkTimers = useCallback(() => {
    if (thinkTimeoutRef.current) {
      window.clearTimeout(thinkTimeoutRef.current);
      thinkTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetMatch = useCallback(() => {
    clearThinkTimers();
    setEnemyThinking(false);
    setEnemyProgress(0);

    setPlayerChoice(null);
    setEnemyChoice(null);
    setLastRound(null);
    setAwaitNextRound(false);
    setMatch({ player: 0, enemy: 0 });
    setScoreboard(createInitialScoreboard());
  }, [clearThinkTimers]);

  const nextRound = useCallback(() => {
    clearThinkTimers();
    setEnemyThinking(false);
    setEnemyProgress(0);

    setAwaitNextRound(false);
    setPlayerChoice(null);
    setEnemyChoice(null);
    setLastRound(null);
  }, [clearThinkTimers]);

  const onPick = useCallback((choice: HawkinsSymbol) => {
    if (matchOver || awaitNextRound || enemyThinking) return; // evita doppio input mentre l'enemy pensa
    synth.select();

    // set giocatore, pulisci precedente
    setPlayerChoice(choice);
    setEnemyChoice(null);
    setLastRound(null);

    // simula pensiero nemico: 0–5000ms
    const delay = Math.floor(Math.random() * 5000);
    const t0 = performance.now();

    setEnemyThinking(true);
    setEnemyProgress(0);

    // progress "smooth" ~60fps (ogni 50ms)
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - t0;
      const pct = Math.min(99, Math.floor((elapsed / Math.max(1, delay)) * 100)); // evita 100% prima del reveal
      setEnemyProgress(isFinite(pct) ? pct : 0);
    }, 50);

    // reveal dopo delay
    thinkTimeoutRef.current = window.setTimeout(() => {
      // stop progress
      clearThinkTimers();
      setEnemyProgress(100);

      const enemy = getRandomSymbol();
      setEnemyChoice(enemy);
      setEnemyThinking(false);

      // valuta round
      const round = judgeRound(choice, enemy);
      setLastRound(round);
      setScoreboard((prev) => applyRoundToScoreboard(prev, round));

      setMatch((m) => {
        if (round.outcome === "PLAYER") return { ...m, player: m.player + 1 };
        if (round.outcome === "ENEMY") return { ...m, enemy: m.enemy + 1 };
        return m;
      });

      if (round.outcome === "PLAYER") { synth.win(); setAwaitNextRound(true); }
      else if (round.outcome === "ENEMY") { synth.lose(); setAwaitNextRound(true); }
      else { synth.draw(); setAwaitNextRound(false); }
    }, delay);
  }, [awaitNextRound, matchOver, enemyThinking, synth, clearThinkTimers]);

  // auto-advance dopo 3s quando in lock post WIN/LOSE
  useEffect(() => {
    if (!awaitNextRound || matchOver) return;
    const id = window.setTimeout(() => nextRound(), 3000);
    return () => window.clearTimeout(id);
  }, [awaitNextRound, matchOver, nextRound]);

  // cleanup on unmount
  useEffect(() => clearThinkTimers, [clearThinkTimers]);

  return {
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

      // NEW
      enemyThinking,
      enemyProgress,
    },
    actions: { setTargetWins, onPick, nextRound, resetMatch },
  };
}
