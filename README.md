# Hawkins Control

A neon‑soaked, Stranger‑Things‑flavored **card duel** built with React + Tailwind.  
Pick your side (Eleven, Demogorgon, or Hawkins Lab), watch the enemy “think,” and race to the target number of wins.  
It’s a tiny arcade you can play in the browser, structured with a clean separation between **engine** (model/controller in `@its-me-mayday/hawkins-control`) and **view** (this React app).

> “Friends don’t lie.” — *Stranger Things*  
> “Mornings are for coffee and contemplation.” — *Chief Hopper*

---

## ✨ Features

- **Fast, clean UI** with a neon CRT vibe (custom `hk-` utility classes + Tailwind).
- **Match setup overlay**: choose “first to N rounds” before you play.
- **Player picks vs enemy AI** with **variable thinking delay** (0–5s) and a live **progress bar**.
- **Auto‑lock celebration** on each round outcome (win/lose/draw) for ~3s, then the next round begins.
- **Animated battle panel** with win/lose/draw feedback.
- **Stats sidebar**: rounds played, draws, win rates, and live match score.
- **Settings dialog** to tweak target rounds at any time.
- **Minimal synth‑FX** (Web Audio API): selection, win, lose, draw.
- **Engine/view split**: business rules live in `@its-me-mayday/hawkins-control`; UI in this app.
- **Keyboard/focus friendly** buttons and semantic markup.

> “You keep your focus; I’ll keep the door.” — *a friendly nod to Eleven*

---

## 🕹️ How to Play

1. Click **Start Match** and pick how many **rounds to win** (e.g., first to 5).  
2. In **Player** area, choose one of the three symbols (Eleven, Demogorgon, Hawkins Lab).  
3. The **Enemy** “thinks” for 0–5 seconds while a progress bar fills.  
4. The **Battle** area reveals both picks and the **round outcome**.  
5. After a short celebration pause, the next round becomes available.  
6. First to the target number of wins **takes the match**. A final overlay lets you start a new one.

> The exact win relationships mirror a rock‑paper‑scissors triangle, implemented in the engine package.  
> (No spoilers here—peek at `@its-me-mayday/hawkins-control` if you’re curious!)

---

## 🧱 Architecture

- **Engine**: `@its-me-mayday/hawkins-control` (symbols, judging, scoreboard utilities).  
- **View**: this React app (components, styling, sound, state glue).
- **State orchestration**: `useGameController()` encapsulates:
  - player/enemy choices
  - round judging and narration
  - scoreboard + match points
  - enemy “thinking” timers + progress
  - round auto‑lock/unlock (3s) and match end detection
- **Audio**: `useSynth()` (Web Audio API) for lightweight synth cues.
- **Styling**: Tailwind + custom CSS rules with the `hk-` namespace (`index.css`).

### Main UI Blocks
- **Header**: title and **Settings** gear button.
- **StartOverlay**: mandatory pre‑match setup (choose target wins).
- **Player Area**: StrangerCards to pick your symbol; folds during enemy thinking/celebration.
- **Battle Area**: appears after first pick; shows duel cards, thinking progress, and narration.
- **StatsPanel**: sticky sidebar with round/match stats.
- **EndOverlay**: final result with **New Match** action.

---

## 🗂️ Notable Components

- `StrangerCard`: image + accent color, win/lose/draw animation, optional alt sources (win/lose art).
- `BattleDuel`: side‑by‑side player/enemy cards, or an enemy **thinking** placeholder with progress bar.
- `BattleView`: plain narration + compact result banner.
- `ControlsBar`: (kept minimal) wiring for target wins control when shown.
- `SettingsDialog`: native `<dialog>` with Tailwind styling.
- `StartOverlay` / `EndOverlay`: full‑screen overlays for match start/end.

---

## 🧪 Game Flow (simplified)

```
Player picks → Enemy thinks (0–5s) → Judge round → Lock 3s (celebration) → Next round
                          ↳ progress bar
Match ends when player or enemy reaches targetWins → End overlay → New match
```

---

## 🚀 Development

Prerequisites: Node 18+ and pnpm (or npm/yarn).

```bash
pnpm install
pnpm dev
```

Then open the local URL printed in your terminal.

### Build

```bash
pnpm build
```

### Lint (if configured)

```bash
pnpm lint
```

---

## 🔧 Configuration Notes

- The app imports art from `src/assets/art.ts` and engine primitives from `@its-me-mayday/hawkins-control`.
- CSS lives in `src/index.css` with Tailwind + `hk-` utilities and keyframes.
- Sounds require a user gesture—`Start Match` calls `synth.arm()` to resume the audio context.

> If you hear nothing, ensure your browser allows sound and you clicked **Start Match** at least once.

---

## ♿ Accessibility

- Buttons have focus rings and labels (`IconButton` uses `aria-label`).  
- Color‑based feedback is paired with text where possible (“YOU WIN / YOU LOSE / DRAW”).  
- Progress has a textual “Thinking…” status in addition to the bar.

---

## 🖼️ Assets & Credits

- Artwork entries are mapped in `src/assets/art.ts` with separate **win/lose** variants.  
- Neon/CRT touches are CSS‑only; no external theme dependency.

> “We’re not heroes. We’re just kids.” — *Dustin Henderson*

---

## 📦 Tech Stack

- **React**, **TypeScript**
- **Tailwind CSS**
- **Web Audio API**
- Engine: **`@its-me-mayday/hawkins-control`**

---

## 📜 License

MIT — see `LICENSE` (or adapt to your needs).

> “Don’t be a mouth‑breather.” — *Steve Harrington*
