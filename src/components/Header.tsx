import { Dices, Compass, Upload } from 'lucide-react';
import type { View } from '@/App';

interface HeaderProps {
  view: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { view: View; label: string; icon: typeof Dices }[] = [
  { view: 'roll', label: 'Roll', icon: Dices },
  { view: 'browse', label: 'Browse', icon: Compass },
  { view: 'upload', label: 'Share a Skill', icon: Upload },
];

export function Header({ view, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate('roll')}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105 group-hover:rotate-6">
            <Dices className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Skill<span className="text-emerald-600">Roulette</span>
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                  active
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
