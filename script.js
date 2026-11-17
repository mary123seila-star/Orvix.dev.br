import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const copyButton = document.querySelector('[data-copy]');
const waitlistForm = document.querySelector('#waitlist-form');
const formMessage = document.querySelector('#form-message');

copyButton?.addEventListener('click', async () => {
  const text = copyButton.getAttribute('data-copy') || '';
  await navigator.clipboard.writeText(text);
  const label = copyButton.querySelector('span');
  if (label) label.textContent = 'Copied to clipboard';
  window.setTimeout(() => { if (label) label.textContent = 'Copy prompt'; }, 1800);
});

waitlistForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const emailValue = new FormData(waitlistForm).get('email');
  const email = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : '';
  if (!email || !email.includes('@') || !supabase) return;

  const { error } = await supabase.from('waitlist_signups').insert({ email });
  if (error && error.code !== '23505') {
    formMessage.textContent = 'Something went wrong. Please try again.';
    formMessage.classList.add('error-message');
    return;
  }

  formMessage.textContent = 'You’re on the list. We’ll be in touch when your invite is ready.';
  formMessage.classList.add('success-message');
  waitlistForm.reset();
});
