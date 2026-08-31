import { Clock, ChevronUp } from 'lucide-react';
import type { Skill } from '@/types';
import { categoryMeta } from '@/lib/categories';

interface SkillCardProps {
  skill: Skill;
  onOpen: (skill: Skill) => void;
  onUpvote: (id: string) => void;
  upvotedIds: Set<string>;
}

export function SkillCard({
  skill,
  onOpen,
  onUpvote,
  upvotedIds,
}: SkillCardProps) {
  const meta = categoryMeta(skill.category);
  const Icon = meta.icon;
  const upvoted = upvotedIds.has(skill.id);
  const mins = Math.floor(skill.estimated_seconds / 60);
  const secs = skill.estimated_seconds % 60;
  const timeLabel = secs === 0 ? `${mins} min` : `${mins}m ${secs}s`;

  return (
    <article
      onClick={() => onOpen(skill)}
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${meta.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.chipBg} ${meta.chipText}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {timeLabel}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-slate-700">
        {skill.title}
      </h3>
      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
        {skill.summary}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-400">
          by {skill.author}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(skill.id);
          }}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all ${
            upvoted
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
          }`}
        >
          <ChevronUp
            className={`h-4 w-4 transition-transform ${upvoted ? 'scale-110' : ''}`}
          />
          {skill.upvotes}
        </button>
      </div>
    </article>
  );
}
