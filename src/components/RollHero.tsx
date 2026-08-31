import { useCallback, useEffect, useRef, useState } from 'react';
import { Dices, Sparkles, Clock, ChevronUp, RefreshCw, ArrowRight } from 'lucide-react';
import type { Skill } from '@/types';
import { supabase } from '@/lib/supabase';
import { categoryMeta } from '@/lib/categories';

interface RollHeroProps {
  onOpenSkill: (skill: Skill) => void;
  onBrowse: () => void;
  onUpvote: (id: string) => void;
  upvotedIds: Set<string>;
}

const FLIP_DURATION = 60;

export function RollHero({
  onOpenSkill,
  onBrowse,
  onUpvote,
  upvotedIds,
}: RollHeroProps) {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<Skill | null>(null);
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayCategory, setDisplayCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const flipTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('upvotes', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data) {
          setAllSkills(data as Skill[]);
        }
      });
  }, []);

  const stopFlip = () => {
    if (flipTimer.current) {
      clearInterval(flipTimer.current);
      flipTimer.current = null;
    }
  };

  useEffect(() => () => stopFlip(), []);

  const roll = useCallback(() => {
    if (rolling || allSkills.length === 0) return;
    setRolling(true);
    setResult(null);

    let count = 0;
    const totalFlips = 18;
    flipTimer.current = setInterval(() => {
      const random = allSkills[Math.floor(Math.random() * allSkills.length)];
      setDisplayTitle(random.title);
      setDisplayCategory(categoryMeta(random.category).label);
      count += 1;
      if (count >= totalFlips) {
        stopFlip();
        const final = allSkills[Math.floor(Math.random() * allSkills.length)];
        setDisplayTitle(final.title);
        setDisplayCategory(categoryMeta(final.category).label);
        setResult(final);
        setRolling(false);
      }
    }, FLIP_DURATION);
  }, [rolling, allSkills]);

  const renderResult = () => {
    if (!result) return null;
    const meta = categoryMeta(result.category);
    const Icon = meta.icon;
    const upvoted = upvotedIds.has(result.id);
    const mins = Math.floor(result.estimated_seconds / 60);
    const secs = result.estimated_seconds % 60;
    const timeLabel = secs === 0 ? `${mins} min` : `${mins}m ${secs}s`;

    return (
      <div className="mx-auto mt-10 max-w-xl animate-[modalIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />
          <div className="p-6 sm:p-8">
            <span
              className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.chipBg} ${meta.chipText}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {result.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-500">
              {result.summary}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {timeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ChevronUp className="h-4 w-4" />
                {result.upvotes} upvotes
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenSkill(result)}
                className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${meta.gradient} px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105`}
              >
                Learn this skill
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onUpvote(result.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                  upvoted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <ChevronUp className="h-4 w-4" />
                {upvoted ? 'Upvoted' : 'This worked'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={roll}
            disabled={rolling}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Roll again
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/40 via-sky-200/30 to-rose-200/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          One skill. Five minutes. Infinite curiosity.
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
          Learn a random
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-rose-600 bg-clip-text text-transparent">
            micro-skill
          </span>{' '}
          right now
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
          Hit the button. Get a bite-sized tutorial you can master in under five
          minutes. Life hacks, tech tricks, social savvy, survival moves — you
          never know what's next.
        </p>

        <button
          onClick={roll}
          disabled={rolling || allSkills.length === 0}
          className="group relative mt-9 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-slate-900/25 transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Dices
            className={`h-6 w-6 transition-transform ${rolling ? 'animate-spin' : 'group-hover:rotate-12'}`}
          />
          {rolling ? 'Rolling...' : 'Roll the Skill'}
        </button>

        {(displayTitle || error) && !result && (
          <div className="mx-auto mt-10 max-w-xl">
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">
                {error}
              </p>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
                <p
                  className={`text-xl font-bold text-slate-900 ${rolling ? 'animate-pulse' : ''}`}
                >
                  {displayTitle}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  {displayCategory}
                </p>
              </div>
            )}
          </div>
        )}

        {renderResult()}

        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-400">
          <span>{allSkills.length} skills in the pool</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <button
            onClick={onBrowse}
            className="font-medium text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
          >
            Browse all
          </button>
        </div>
      </div>
    </section>
  );
}
