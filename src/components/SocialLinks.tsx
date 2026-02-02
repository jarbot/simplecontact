'use client';

import { SocialIcon } from './SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {links.map((link, index) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center border rounded-xl social-link"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
            animationDelay: `${(index + 1) * 125}ms`,
          }}
          aria-label={`Visit ${link.platform}`}
          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
        >
          <SocialIcon platform={link.platform} className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
