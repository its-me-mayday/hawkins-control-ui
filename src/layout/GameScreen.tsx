import GameArea from "../sections/GameArea";
import StrangerCard from "../components/StrangerCard";
import MatchBadge from "../components/MatchBadge";
import SettingsDialog from "../components/SettingsDialog";
import StatsDialog from "../components/StatsDialog";
import BattleDuel from "../components/BattleDuel";
import StartOverlay from "../components/StartOverlay";
import EndOverlay from "../components/EndOverlay";
import AppFooter from "./AppFooter";
import { ART } from "../assets/art";
import { HAWKINS_SYMBOLS, type HawkinsSymbol } from "@its-me-mayday/hawkins-control";
import type { HeroKey } from "../constants/heroes";

type Outcome = "PLAYER" | "ENEMY" | "DRAW" | null;

type Props = {
  matchPlayer: number;
  matchEnemy: number;
  targetWins: number;

  settingsOpen: boolean;
  statsOpen: boolean;
  onCloseSettings: () => void;
  onCloseStats: () => void;

  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number;
  onToggleMusic: (value: boolean) => void;
  onToggleSfx: (value: boolean) => void;
  onChangeMusicVolume: (value: number) => void;

  wins: number;
  losses: number;
  draws: number;

  started: boolean;
  playerFolded: boolean;
  disablePlay: boolean;
  battleShown: boolean;
  battleAnim: string;

  playerChoice: HawkinsSymbol | null;
  enemyChoice: HawkinsSymbol | null;
  lastOutcome: Outcome | undefined;
  lastNarration: string | null | undefined;
  awaitNextRound: boolean;
  enemyThinking: boolean;
  enemyProgress: number;

  onSelectCard: (symbol: HawkinsSymbol) => void;

  startOverlayOpen: boolean;
  startOverlayDefaultTarget: number;
  hero: HeroKey;
  onChangeHero: (hero: HeroKey) => void;
  onStartMatch: (rounds: number) => void;

  endOverlayOpen: boolean;
  winnerText: string | null;
  matchResult: Outcome;
  heroName: string;
  heroId: HeroKey;
  onNewMatch: () => void;
};

export default function GameScreen({
  matchPlayer,
  matchEnemy,
  targetWins,
  settingsOpen,
  statsOpen,
  onCloseSettings,
  onCloseStats,
  musicOn,
  sfxOn,
  musicVolume,
  onToggleMusic,
  onToggleSfx,
  onChangeMusicVolume,
  wins,
  losses,
  draws,
  started,
  playerFolded,
  disablePlay,
  battleShown,
  battleAnim,
  playerChoice,
  enemyChoice,
  lastOutcome,
  lastNarration,
  awaitNextRound,
  enemyThinking,
  enemyProgress,
  onSelectCard,
  startOverlayOpen,
  startOverlayDefaultTarget,
  hero,
  onChangeHero,
  onStartMatch,
  endOverlayOpen,
  winnerText,
  matchResult,
  heroName,
  heroId,
  onNewMatch,
}: Props) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex justify-center">
        <MatchBadge player={matchPlayer} enemy={matchEnemy} targetWins={targetWins} />
      </div>

      <SettingsDialog
        open={settingsOpen}
        onClose={onCloseSettings}
        musicOn={musicOn}
        sfxOn={sfxOn}
        musicVolume={musicVolume}
        onToggleMusic={onToggleMusic}
        onToggleSfx={onToggleSfx}
        onChangeMusicVolume={onChangeMusicVolume}
      />

      <StatsDialog
        open={statsOpen}
        onClose={onCloseStats}
        wins={wins}
        losses={losses}
        draws={draws}
        playerScore={matchPlayer}
        enemyScore={matchEnemy}
        heroName={heroName}
      />

      <div className="flex-1">
        <div className="space-y-6 min-w-0">
          <div className={playerFolded ? "hk-fold hk-fold--collapsed" : "hk-fold hk-fold--open"}>
            <GameArea
              variant="player"
              title="Player"
              subtitle={started ? "Choose your side" : "Tune the experiment and start"}
            >
              <div className="relative">
                <div
                  className={`grid grid-cols-3 gap-2 sm:gap-5 mt-1 sm:mt-2 justify-items-center ${
                    disablePlay ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {HAWKINS_SYMBOLS.map((symbol: HawkinsSymbol) => (
                    <div key={symbol} className="flex justify-center">
                      <StrangerCard
                        label={symbol}
                        selected={playerChoice === symbol}
                        outcomeForSelected={
                          playerChoice === symbol ? lastOutcome ?? null : null
                        }
                        imageSrc={ART[symbol].src}
                        imageWinSrc={ART[symbol].win ?? ART[symbol].src}
                        imageLoseSrc={ART[symbol].lose ?? ART[symbol].src}
                        imageAlt={ART[symbol].alt}
                        imageFit={ART[symbol].fit}
                        imagePosition={ART[symbol].pos}
                        useWinImage={
                          awaitNextRound &&
                          playerChoice === symbol &&
                          lastOutcome === "PLAYER"
                        }
                        useLoseImage={
                          awaitNextRound &&
                          playerChoice === symbol &&
                          lastOutcome === "ENEMY"
                        }
                        aspect={ART[symbol].aspect}
                        onSelect={() => onSelectCard(symbol)}
                        className="w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[190px]"
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
              subtitle={
                started
                  ? "Cards clash under Hawkins neon."
                  : "Set rounds and start the experiment."
              }
              className={battleAnim}
            >
              <BattleDuel
                player={started ? playerChoice : null}
                enemy={started ? enemyChoice : null}
                outcome={started ? lastOutcome ?? null : null}
                narration={started ? lastNarration ?? null : null}
                locked={awaitNextRound}
                thinking={started && enemyThinking}
                progress={enemyProgress}
              />
            </GameArea>
          )}
        </div>
      </div>

      <AppFooter />

      <StartOverlay
        open={startOverlayOpen}
        defaultTarget={startOverlayDefaultTarget}
        hero={hero}
        onChangeHero={onChangeHero}
        onStart={onStartMatch}
      />
      <EndOverlay
        open={endOverlayOpen}
        winnerText={winnerText}
        result={matchResult}
        heroId={heroId}
        heroName={heroName}
        onNewMatch={onNewMatch}
      />
    </main>
  );
}
