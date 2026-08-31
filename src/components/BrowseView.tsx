import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, Compass } from 'lucide-react';
import type { Skill, Category } from '@/types';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LIST, categoryMeta } from '@/lib/categories';
import { SkillCard } from '@/components/SkillCard';

interface BrowseViewProps {
  onOpenSkill: (skill: Skill) => void;
  onUpvote: (id: string) => void;
  upvotedIds: Set<string>;
}

type SortKey = 'top' | 'new' | 'quick';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'top', label: 'Top voted' },
  { key: 'new', label: 'Newest' },
  { key: 'quick', label: 'Quickest' },
];

export function BrowseView({
  onOpenSkill,
  onUpvote,
  upvotedIds,
}: BrowseViewProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('top');

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('upvotes', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else if (data) setSkills(data as Skill[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = skills;
    if (activeCat !== 'all') list = list.filter((s) => s.category === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    if (sort === 'top') sorted.sort((a, b) => b.upvotes - a.upvotes);
    if (sort === 'new')
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    if (sort === 'quick')
      sorted.sort((a, b) => a.estimated_seconds - b.estimated_seconds);
    return sorted;
  }, [skills, activeCat, query, sort]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Browse all skills
        </h1>
        <p className="mt-2 text-slate-500">
          {skills.length} micro-skills from the community — find your next
          five-minute win.
        </p>
      </div>

      {/* Search + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, tags..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          <SlidersHorizontal className="ml-2 mr-1 h-4 w-4 text-slate-400" />
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                sort === s.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat('all')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeCat === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {CATEGORY_LIST.map(([key, meta]) => {
          const Icon = meta.icon;
          const active = activeCat === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCat(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? `bg-gradient-to-r ${meta.gradient} text-white shadow-md`
                  : `${meta.chipBg} ${meta.chipText} hover:opacity-80`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      ) : error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Compass className="h-12 w-12 text-slate-200" />
          <p className="mt-4 text-lg font-semibold text-slate-700">
            No skills found
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onOpen={onOpenSkill}
              onUpvote={onUpvote}
              upvotedIds={upvotedIds}
            />
          ))}
        </div>
      )}
    </section>
  );
}
