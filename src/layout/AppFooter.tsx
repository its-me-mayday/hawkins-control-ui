export default function AppFooter() {
    return (
      <footer className="mt-2 border-t border-slate-800 pt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[0.7rem] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.18em] text-slate-500">
            S1 rule
          </span>
          <span>
            Eleven beats Demogorgon, Demogorgon beats Hawkins Lab, Hawkins Lab beats Eleven.
          </span>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="uppercase tracking-[0.16em] text-slate-500">
            Hawkins Control · Season 1
          </span>
          <a
            href="https://github.com/its-me-mayday"
            target="_blank"
            rel="noreferrer"
            className="uppercase tracking-[0.22em] text-slate-300 hover:text-rose-300 transition-colors"
          >
            @its-me-mayday
          </a>
        </div>
      </footer>
    );
  }
  