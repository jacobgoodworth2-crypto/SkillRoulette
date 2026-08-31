export type Category =
  | 'life-hack'
  | 'tech-work'
  | 'social'
  | 'survival'
  | 'creative'
  | 'kitchen';

export interface Skill {
  id: string;
  title: string;
  summary: string;
  category: Category;
  steps: string[];
  estimated_seconds: number;
  author: string;
  tags: string[];
  upvotes: number;
  created_at: string;
}

export interface SkillInput {
  title: string;
  summary: string;
  category: Category;
  steps: string[];
  estimated_seconds: number;
  author: string;
  tags: string[];
}
