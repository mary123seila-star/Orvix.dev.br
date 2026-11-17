import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const copyButton = document.querySelector('[data-copy]');
const waitlistForm = document.querySelector('#waitlist-form');
const formMessage = document.querySelector('#form-message');
const submitButton = document.querySelector('#waitlist-submit');

copyButton?.addEventListener('click', async () => {
  const text = copyButton.getAttribute('data-copy') || '';
  await navigator.clipboard.writeText(text);
  const label = copyButton.querySelector('span');
  if (label) label.textContent = 'Copied to clipboard';
  window.setTimeout(() => { if (label) label.textContent = 'Copy prompt'; }, 1800);
});

const faqAccordion = document.querySelector('#faq-accordion');
faqAccordion?.addEventListener('click', (event) => {
  const target = event.target.closest('details.faq-item');
  if (!target) return;
  const isOpen = target.hasAttribute('open');
  faqAccordion.querySelectorAll('details.faq-item[open]').forEach((item) => {
    if (item !== target) item.removeAttribute('open');
  });
  if (isOpen) target.removeAttribute('open');
});

waitlistForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(waitlistForm);
  const emailValue = formData.get('email');
  const nameValue = formData.get('full_name');
  const email = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : '';
  const fullName = typeof nameValue === 'string' ? nameValue.trim() : '';
  if (!email || !email.includes('@') || !fullName || !supabase) return;

  if (submitButton) {
    submitButton.disabled = true;
    const label = submitButton.querySelector('span');
    if (label) label.textContent = 'Joining…';
  }

  const { error } = await supabase
    .from('waitlist_signups')
    .insert({ email, full_name: fullName });

  if (error && error.code !== '23505') {
    formMessage.textContent = 'Something went wrong. Please try again.';
    formMessage.classList.remove('success-message');
    formMessage.classList.add('error-message');
    if (submitButton) {
      submitButton.disabled = false;
      const label = submitButton.querySelector('span');
      if (label) label.textContent = 'Join waitlist ↗';
    }
    return;
  }

  formMessage.textContent = "You're on the list. We'll be in touch when your invite is ready.";
  formMessage.classList.remove('error-message');
  formMessage.classList.add('success-message');
  waitlistForm.reset();
  if (submitButton) {
    submitButton.disabled = false;
    const label = submitButton.querySelector('span');
    if (label) label.textContent = 'Join waitlist ↗';
  }
});
