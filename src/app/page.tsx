import { connection } from 'next/server';
import { getConfig, getSocialLinks, getAvatarUrl } from '@/lib/config';
import { SocialLinks } from '@/components/SocialLinks';
import { ContactForm } from '@/components/ContactForm';

export default async function Home() {
  // Force dynamic rendering so nonce is generated per-request
  await connection();
  const config = getConfig();
  const socialLinks = getSocialLinks(config);
  const avatarUrl = getAvatarUrl(config);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 md:py-24">
      <div className="w-full max-w-lg mx-auto">
        {/* Profile Section */}
        <div className="text-center">
          {avatarUrl && (
            <div className="mb-8 opacity-0 animate-fade-down">
              <img
                src={avatarUrl}
                alt={config.name}
                className="w-36 h-36 md:w-44 md:h-44 mx-auto object-cover profile-image"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 opacity-0 animate-fade-up animation-delay-100">
            {config.name}
          </h1>

          {config.title && (
            <p className="text-lg md:text-xl mb-6 opacity-0 animate-fade-up animation-delay-200" style={{ color: 'var(--text-secondary)' }}>
              {config.title}
            </p>
          )}

          {config.bio && (
            <p className="text-base max-w-md mx-auto mb-8 opacity-0 animate-fade-up animation-delay-300" style={{ color: 'var(--text-muted)' }}>
              {config.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-12 opacity-0 animate-fade-up animation-delay-400">
            <SocialLinks links={socialLinks} />
          </div>
        )}

        {/* Email Link */}
        {config.email && (
          <div className="text-center mb-12 opacity-0 animate-fade-up animation-delay-500">
            <a
              href={`mailto:${config.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 border rounded-xl social-link"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {config.email}
            </a>
          </div>
        )}

        {/* Contact Form */}
        {config.contactForm.enabled && (
          <div className="opacity-0 animate-fade-in animation-delay-500">
            <ContactForm
              heading={config.contactForm.heading}
              description={config.contactForm.description}
              successMessage={config.contactForm.successMessage}
              recaptchaEnabled={config.contactForm.recaptcha.enabled}
              recaptchaSiteKey={config.contactForm.recaptcha.siteKey}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm opacity-0 animate-fade-in animation-delay-500" style={{ color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} {config.name}</p>
      </footer>
    </main>
  );
}
