'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';

interface ContactFormProps {
  heading: string;
  description: string;
  successMessage: string;
  recaptchaEnabled: boolean;
  recaptchaSiteKey: string;
}

// Extend window for reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ContactForm({
  heading,
  description,
  successMessage,
  recaptchaEnabled,
  recaptchaSiteKey,
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (!recaptchaEnabled || !recaptchaSiteKey) return;

    // Check if already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setRecaptchaReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => setRecaptchaReady(true));
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [recaptchaEnabled, recaptchaSiteKey]);

  // Get reCAPTCHA token
  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!recaptchaEnabled || !recaptchaSiteKey || !recaptchaReady) {
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact_submit' });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return '';
    }
  }, [recaptchaEnabled, recaptchaSiteKey, recaptchaReady]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Get reCAPTCHA v3 token
      const recaptchaToken = await getRecaptchaToken();

      if (recaptchaEnabled && !recaptchaToken) {
        setErrorMessage('reCAPTCHA verification failed. Please refresh and try again.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <h2 className="text-2xl md:text-3xl mb-2 text-center">{heading}</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--text-muted)' }}>{description}</p>

        {submitStatus === 'success' ? (
          <div
            className="p-6 rounded-xl text-center border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--accent-color)',
              color: 'var(--accent-color)'
            }}
          >
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="Your name"
              aria-label="Your name"
            />

            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="your@email.com"
              aria-label="Your email"
            />

            {submitStatus === 'error' && (
              <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 font-medium rounded-xl btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
