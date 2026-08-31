import { useState } from 'react';
import { Upload, Check, Loader2, Plus, X, Clock } from 'lucide-react';
import type { Category, Skill } from '@/types';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LIST } from '@/lib/categories';

interface UploadViewProps {
  onUploaded: (skill: Skill) => void;
}

export function UploadView({ onUploaded }: UploadViewProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Category>('life-hack');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [steps, setSteps] = useState<string[]>(['', '']);
  const [seconds, setSeconds] = useState(300);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const updateStep = (i: number, val: string) => {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  };
  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i));

  const valid =
    title.trim().length > 3 &&
    summary.trim().length > 10 &&
    steps.filter((s) => s.trim().length > 0).length >= 2;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    const cleanTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const { data, error: err } = await supabase
      .from('skills')
      .insert({
        title: title.trim(),
        summary: summary.trim(),
        category,
        steps: cleanSteps,
        estimated_seconds: seconds,
        author: author.trim() || 'Anonymous',
        tags: cleanTags,
      })
      .select()
      .single();

    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    onUploaded(data as Skill);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setSummary('');
      setAuthor('');
      setTags('');
      setSteps(['', '']);
      setSeconds(300);
    }, 1800);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5';

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Share a micro-skill
        </h1>
        <p className="mt-2 text-slate-500">
          Teach the world something useful in under five minutes. Keep it
          specific, practical, and easy to follow.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Skill title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Open a locked padlock with a soda can"
            className={inputClass}
            maxLength={120}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            One-line summary
          </label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What will someone be able to do?"
            className={inputClass}
            maxLength={160}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LIST.map(([key, meta]) => {
              const Icon = meta.icon;
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
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
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Steps
            </label>
            <span className="text-xs text-slate-400">
              {steps.filter((s) => s.trim()).length} added
            </span>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <input
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}: what to do`}
                  className={inputClass}
                />
                {steps.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <Plus className="h-4 w-4" />
            Add step
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Your name <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anonymous"
              className={inputClass}
              maxLength={60}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Tags <span className="font-normal text-slate-400">(comma separated)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="locks, emergency"
              className={inputClass}
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              Estimated time
            </span>
            <span className="font-bold text-slate-900">
              {mins}m {secs}s
            </span>
          </label>
          <input
            type="range"
            min={30}
            max={300}
            step={30}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="w-full accent-slate-900"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>30s</span>
            <span>5 min</span>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || submitting || success}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/25 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {success ? (
            <>
              <Check className="h-5 w-5" />
              Skill shared!
            </>
          ) : submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Publish skill
            </>
          )}
        </button>
      </form>
    </section>
  );
}
