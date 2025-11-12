import { useEffect, useRef, useState } from "react";
import {
  judgeRound,
  getRandomSymbol,
  applyRoundToScoreboard,
  createInitialScoreboard,
  type HawkinsSymbol,
  type RoundResult,
  type Scoreboard,
} from "@its-me-mayday/hawkins-control";

const STORAGE_KEY = "hawkins-control:v1";

type MatchScore = { player: number; enemy: number };

export function useGameController() {
  const [playerChoice, setPlayerChoice] = useState<HawkinsSymbol | null>(null);
  const [enemyChoice, setEnemyChoice] = useState<HawkinsSymbol | null>(null);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard>(createInitialScoreboard());
  const [targetWins, setTargetWins] = useState<number>(5);
  const [match, setMatch] = useState<MatchScore>({ player: 0, enemy: 0 });

  const [awaitNextRound, setAwaitNextRound] = useState(false);
  const [enemyThinking, setEnemyThinking] = useState(false);
  const [enemyProgress, setEnemyProgress] = useState(0);
  const [enemyRevealAt, setEnemyRevealAt] = useState<number | null>(null);

  const thinkTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const roundUnlockRef = useRef<number | null>(null);

  const matchOver = match.player >= targetWins || match.enemy >= targetWins;
  const winnerText = matchOver ? (match.player >= targetWins ? "YOU WON THE MATCH" : "ENEMY WON THE MATCH") : null;

  useEffect(() => {
    const payload = { targetWins, match, scoreboard };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
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

  useEffect(() => {
    return () => {
      if (thinkTimerRef.current) window.clearTimeout(thinkTimerRef.current);
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
      if (roundUnlockRef.current) window.clearTimeout(roundUnlockRef.current);
    };
  }, []);

  const resetRound = () => {
    setPlayerChoice(null);
    setEnemyChoice(null);
    setLastRound(null);
    setEnemyThinking(false);
    setEnemyProgress(0);
    setEnemyRevealAt(null);
  };

  const resetMatch = () => {
    if (thinkTimerRef.current) window.clearTimeout(thinkTimerRef.current);
    if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
    if (roundUnlockRef.current) window.clearTimeout(roundUnlockRef.current);
    resetRound();
    setScoreboard(createInitialScoreboard());
    setMatch({ player: 0, enemy: 0 });
    setAwaitNextRound(false);
  };

  const onPick = (choice: HawkinsSymbol) => {
    if (matchOver || awaitNextRound || enemyThinking) return;

    setPlayerChoice(choice);

    const totalMs = Math.floor(Math.random() * 5001);
    setEnemyThinking(true);
    setEnemyProgress(0);

    const startedAt = performance.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const pct = totalMs === 0 ? 100 : Math.min(100, Math.round((elapsed / totalMs) * 100));
      setEnemyProgress(pct);
      if (pct >= 100 && progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }, 50);

    thinkTimerRef.current = window.setTimeout(() => {
      const enemy = getRandomSymbol();
      setEnemyChoice(enemy);
      setEnemyRevealAt(Date.now());
      setEnemyThinking(false);
      setEnemyProgress(100);

      const round = judgeRound(choice, enemy);
      setLastRound(round);
      setScoreboard((prev) => applyRoundToScoreboard(prev, round));

      setMatch((m) => {
        if (round.outcome === "PLAYER") return { ...m, player: m.player + 1 };
        if (round.outcome === "ENEMY") return { ...m, enemy: m.enemy + 1 };
        return m;
      });

      setAwaitNextRound(true);

      roundUnlockRef.current = window.setTimeout(() => {
        setAwaitNextRound(false);
        if (!matchOver) {
          resetRound();
        }
      }, 3000);
    }, totalMs);
  };

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
      enemyThinking,
      enemyProgress,
      enemyRevealAt,
    },
    actions: {
      setTargetWins,
      onPick,
      nextRound: () => {},
      resetMatch,
    },
  };
}
