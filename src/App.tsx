import { useCallback, useState } from 'react';
import { Header } from '@/components/Header';
import { RollHero } from '@/components/RollHero';
import { BrowseView } from '@/components/BrowseView';
import { UploadView } from '@/components/UploadView';
import { SkillDetail } from '@/components/SkillDetail';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

export type View = 'roll' | 'browse' | 'upload';

export default function App() {
  const [view, setView] = useState<View>('roll');
  const [selected, setSelected] = useState<Skill | null>(null);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('skillroulette_upvotes');
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const persistUpvotes = (next: Set<string>) => {
    setUpvotedIds(next);
    try {
      localStorage.setItem(
        'skillroulette_upvotes',
        JSON.stringify([...next]),
      );
    } catch {
      /* ignore */
    }
  };

  const handleUpvote = useCallback(
    async (id: string) => {
      if (upvotedIds.has(id)) return;
      const { data, error } = await supabase.rpc('upvote_skill', {
        p_skill_id: id,
      });
      if (error) return;
      persistUpvotes(new Set([...upvotedIds, id]));
      setSelected((prev) =>
        prev && prev.id === id
          ? { ...prev, upvotes: (data as number) ?? prev.upvotes + 1 }
          : prev,
      );
    },
    [upvotedIds],
  );

  const openSkill = (skill: Skill) => setSelected(skill);
  const closeSkill = () => setSelected(null);

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Header view={view} onNavigate={navigate} />

      <main>
        {view === 'roll' && (
          <RollHero
            onOpenSkill={openSkill}
            onBrowse={() => navigate('browse')}
            onUpvote={handleUpvote}
            upvotedIds={upvotedIds}
          />
        )}
        {view === 'browse' && (
          <BrowseView
            onOpenSkill={openSkill}
            onUpvote={handleUpvote}
            upvotedIds={upvotedIds}
          />
        )}
        {view === 'upload' && (
          <UploadView
            onUploaded={() => {
              /* skill added; browse will refetch */
            }}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-400 sm:px-6">
          Skill Roulette — learn one thing in five minutes.
        </div>
      </footer>

      {selected && (
        <SkillDetail
          skill={selected}
          onClose={closeSkill}
          onUpvote={handleUpvote}
          upvoted={upvotedIds.has(selected.id)}
        />
      )}
    </div>
  );
}
