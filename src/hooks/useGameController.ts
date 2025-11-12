import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ targetWins, match, scoreboard })
      );
    } catch {}
  }, [storageKey, targetWins, match, scoreboard]);

  const resetMatch = () => {
    setPlayerChoice(null);
    setEnemyChoice(null);
    setLastRound(null);
    setAwaitNextRound(false);
    setMatch({ player: 0, enemy: 0 });
    setScoreboard(createInitialScoreboard());
  };

  const nextRound = () => {
    setAwaitNextRound(false);
    setPlayerChoice(null);
    setEnemyChoice(null);
    setLastRound(null);
  };

  const onPick = (choice: HawkinsSymbol) => {
    if (matchOver || awaitNextRound) return;
    synth.select();
    setPlayerChoice(choice);
    const enemy = getRandomSymbol();
    setEnemyChoice(enemy);
    const round = judgeRound(choice, enemy);
    setLastRound(round);
    setScoreboard((prev) => applyRoundToScoreboard(prev, round));
    setMatch((m) => {
      if (round.outcome === "PLAYER") return { ...m, player: m.player + 1 };
      if (round.outcome === "ENEMY") return { ...m, enemy: m.enemy + 1 };
      return m;
    });
    if (round.outcome === "PLAYER") {
      synth.win();
      setAwaitNextRound(true);
    } else if (round.outcome === "ENEMY") {
      synth.lose();
      setAwaitNextRound(true);
    } else {
      synth.draw();
      setAwaitNextRound(false);
    }
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
    },
    actions: { setTargetWins, onPick, nextRound, resetMatch },
  };
}