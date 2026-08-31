/*
# Create skills table and upvote function (single-tenant, no auth)

1. New Tables
- `skills` — stores micro-skill tutorials.
  - `id` (uuid, primary key)
  - `title` (text, not null) — short headline of the skill
  - `summary` (text, not null) — one-line teaser
  - `category` (text, not null) — life-hack / tech-work / social / survival / creative / kitchen
  - `steps` (text[], not null) — ordered list of instructional steps
  - `estimated_seconds` (int, not null, default 300) — target completion time
  - `author` (text, not null, default 'Anonymous') — submitter display name
  - `tags` (text[], default '{}') — optional free-form tags
  - `upvotes` (int, not null, default 0) — community vote count
  - `created_at` (timestamptz, default now())
- index on `created_at` (browse/sort by newest) and `category` (category filtering).

2. Security
- Enable RLS on `skills`.
- Allow anon + authenticated full CRUD because the data is intentionally
  shared/public (single-tenant, no sign-in screen).

3. Functions
- `upvote_skill(p_skill_id uuid)` — atomically increments the `upvotes`
  counter of the given skill by 1 and returns the new count. SECURITY
  INVOKER so it respects RLS. Used for the community upvote button.

4. Notes
- The app has NO sign-in screen, so every policy lists `anon, authenticated`.
  An `authenticated`-only policy here would make the table look empty to the
  anon-key frontend.
*/

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('life-hack','tech-work','social','survival','creative','kitchen')
  ),
  steps text[] NOT NULL,
  estimated_seconds int NOT NULL DEFAULT 300 CHECK (estimated_seconds > 0 AND estimated_seconds <= 300),
  author text NOT NULL DEFAULT 'Anonymous',
  tags text[] NOT NULL DEFAULT '{}',
  upvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skills_created_at ON skills (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);
CREATE INDEX IF NOT EXISTS idx_skills_upvotes ON skills (upvotes DESC);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_skills" ON skills;
CREATE POLICY "anon_insert_skills" ON skills FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_skills" ON skills;
CREATE POLICY "anon_update_skills" ON skills FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_skills" ON skills;
CREATE POLICY "anon_delete_skills" ON skills FOR DELETE
  TO anon, authenticated USING (true);

-- Atomic single-use upvote incrementer.
CREATE OR REPLACE FUNCTION upvote_skill(p_skill_id uuid)
RETURNS int
LANGUAGE sql
SECURITY INVOKER
AS $$
  UPDATE skills SET upvotes = upvotes + 1 WHERE id = p_skill_id
  RETURNING upvotes;
$$;
