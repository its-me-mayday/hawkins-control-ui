import StrangerCard from "./components/StrangerCard";
import { HAWKINS_SYMBOLS } from "@its-me-mayday/hawkins-control";
import "./index.css";
import GameArea from "./sections/GameArea";

export default function App() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="hk-title animate-hk-flash text-4xl sm:text-5xl">Hawkins Control</h1>
        <p className="text-(--hawkins-muted) mt-2">Eleven vs Demogorgon vs Hawkins Lab</p>
      </header>

      <GameArea variant="enemy" title="Enemy" subtitle="The computer is watching the lights flicker...">
        <div className="text-sm text-(--hawkins-ink)/80 p-2">
          Waiting for your move…
        </div>
      </GameArea>

      <GameArea variant="battle" title="Battle" subtitle="Make your move to shift the balance in Hawkins.">
        <div className="text-sm text-(--hawkins-ink)/80 p-10">
          No clash yet.
        </div>
      </GameArea>

      <GameArea variant="player" title="Player" subtitle="Choose your side">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2 p-2">
          {HAWKINS_SYMBOLS.map((symbol) => (
            <StrangerCard key={symbol} label={symbol} />
          ))}
        </div>
      </GameArea>
    </main>
  );
}
