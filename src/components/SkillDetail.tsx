import { useEffect } from 'react';
import { Clock, ChevronUp, X, Tag, User } from 'lucide-react';
import type { Skill } from '@/types';
import { categoryMeta } from '@/lib/categories';

interface SkillDetailProps {
  skill: Skill;
  onClose: () => void;
  onUpvote: (id: string) => void;
  upvoted: boolean;
}

export function SkillDetail({
  skill,
  onClose,
  onUpvote,
  upvoted,
}: SkillDetailProps) {
  const meta = categoryMeta(skill.category);
  const Icon = meta.icon;
  const mins = Math.floor(skill.estimated_seconds / 60);
  const secs = skill.estimated_seconds % 60;
  const timeLabel = secs === 0 ? `${mins} min` : `${mins}m ${secs}s`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-[modalIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className={`h-2 bg-gradient-to-r ${meta.gradient}`} />

        <div className="flex items-start justify-between gap-4 p-6 pb-4 sm:p-8 sm:pb-5">
          <div className="flex-1">
            <span
              className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.chipBg} ${meta.chipText}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {skill.title}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-500">
              {skill.summary}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-6 pb-4 text-sm text-slate-500 sm:px-8">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            {timeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            {skill.author}
          </span>
          {skill.tags.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-slate-400" />
              {skill.tags.join(', ')}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Follow these steps
          </h3>
          <ol className="space-y-4">
            {skill.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${meta.gradient} text-sm font-bold text-white shadow-sm`}
                >
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed text-slate-700">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 p-5 sm:px-8">
          <span className="text-sm text-slate-400">
            {skill.upvotes} {skill.upvotes === 1 ? 'person learned' : 'people learned'} this
          </span>
          <button
            onClick={() => onUpvote(skill.id)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              upvoted
                ? 'bg-emerald-100 text-emerald-700'
                : `bg-gradient-to-r ${meta.gradient} text-white shadow-lg hover:scale-105`
            }`}
          >
            <ChevronUp className="h-4 w-4" />
            {upvoted ? 'Upvoted' : 'This worked for me'}
          </button>
        </div>
      </div>
    </div>
  );
}
