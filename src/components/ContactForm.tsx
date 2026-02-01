'use client';

import { useState, useRef, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactFormProps {
  heading: string;
  description: string;
  successMessage: string;
  primaryColor: string;
  recaptchaEnabled: boolean;
  recaptchaSiteKey: string;
}

export function ContactForm({
  heading,
  description,
  successMessage,
  primaryColor,
  recaptchaEnabled,
  recaptchaSiteKey,
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      let recaptchaToken = '';

      if (recaptchaEnabled && recaptchaRef.current) {
        recaptchaToken = recaptchaRef.current.getValue() || '';

        if (!recaptchaToken) {
          setErrorMessage('Please complete the reCAPTCHA verification.');
          setIsSubmitting(false);
          return;
        }
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
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
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
      <h2 className="text-2xl font-bold mb-2 text-center">{heading}</h2>
      <p className="text-gray-600 mb-6 text-center">{description}</p>

      {submitStatus === 'success' ? (
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
        >
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-shadow"
              style={{
                '--tw-ring-color': primaryColor,
              } as React.CSSProperties}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-shadow"
              style={{
                '--tw-ring-color': primaryColor,
              } as React.CSSProperties}
              placeholder="your@email.com"
            />
          </div>

          {recaptchaEnabled && recaptchaSiteKey && (
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
              />
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-white font-medium rounded-lg transition-opacity disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
