/*
# Create the Orvix private alpha waitlist

1. New Tables
- `waitlist_signups`
- `id` (uuid, primary key) identifies each signup.
- `email` (text, unique, lowercase) stores the contact address submitted by a visitor.
- `created_at` (timestamptz) records when the visitor joined.

2. Security
- Enable row level security on `waitlist_signups`.
- Allow the public website to insert waitlist signups without exposing existing email addresses.
- Grant only INSERT access to anonymous and authenticated visitors.

3. Important Notes
- This is a single-purpose, no-sign-in waitlist table.
- Email uniqueness prevents duplicate invitations while keeping the public surface write-only.
*/

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL CHECK (email = lower(email) AND length(email) <= 320),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.waitlist_signups TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can join the Orvix waitlist" ON public.waitlist_signups;
CREATE POLICY "Anyone can join the Orvix waitlist"
  ON public.waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email = lower(email) AND length(email) <= 320);
