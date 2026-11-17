/*
# Add full_name column to waitlist_signups

1. Modified Tables
- `waitlist_signups`
- Add `full_name` (text, not null) column to store the visitor's full name alongside their email.

2. Security
- No policy changes. The existing INSERT policy for anon + authenticated remains in place.
- The existing INSERT grant covers the new column automatically.

3. Important Notes
- The column is required (NOT NULL) so every waitlist signup includes a name.
- This is a non-destructive ALTER TABLE ADD COLUMN; existing rows are not affected because the table is empty (new project).
- The INSERT policy's WITH CHECK still validates email format and length; full_name is simply stored.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'waitlist_signups' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.waitlist_signups ADD COLUMN full_name text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Drop the default now that the column exists for all future inserts requiring a real name.
ALTER TABLE public.waitlist_signups ALTER COLUMN full_name DROP DEFAULT;
