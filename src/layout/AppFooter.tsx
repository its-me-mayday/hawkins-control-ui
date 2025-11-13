export default function AppFooter() {
    return (
      <footer className="mt-2 border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[0.7rem] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.18em] text-slate-500">
            S1 rule
          </span>
          <span>
            Eleven beats Demogorgon, Demogorgon beats Hawkins Lab, Hawkins Lab beats Eleven.
          </span>
        </div>
        <span className="uppercase tracking-[0.16em] text-slate-500">
          Hawkins Control · Season 1
        </span>
      </footer>
    );
  }
  