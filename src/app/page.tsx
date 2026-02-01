import { getConfig, getSocialLinks } from '@/lib/config';
import { SocialLinks } from '@/components/SocialLinks';
import { ContactForm } from '@/components/ContactForm';

export default function Home() {
  const config = getConfig();
  const socialLinks = getSocialLinks(config);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-12">
          {config.avatar && (
            <div className="mb-6">
              <img
                src={config.avatar}
                alt={config.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4"
                style={{ borderColor: config.theme.primaryColor }}
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-2">{config.name}</h1>

          {config.title && (
            <p
              className="text-xl mb-4"
              style={{ color: config.theme.primaryColor }}
            >
              {config.title}
            </p>
          )}

          {config.bio && (
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {config.bio}
            </p>
          )}

          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="inline-block mb-8 hover:underline"
              style={{ color: config.theme.primaryColor }}
            >
              {config.email}
            </a>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-16">
            <SocialLinks
              links={socialLinks}
              primaryColor={config.theme.primaryColor}
            />
          </div>
        )}

        {/* Contact Form */}
        {config.contactForm.enabled && (
          <div className="border-t pt-12">
            <ContactForm
              heading={config.contactForm.heading}
              description={config.contactForm.description}
              successMessage={config.contactForm.successMessage}
              primaryColor={config.theme.primaryColor}
              recaptchaEnabled={config.contactForm.recaptcha.enabled}
              recaptchaSiteKey={config.contactForm.recaptcha.siteKey}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {config.name}</p>
      </footer>
    </main>
  );
}
