'use client';

import { SocialIcon } from './SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  primaryColor: string;
}

export function SocialLinks({ links, primaryColor }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
          aria-label={`Visit ${link.platform}`}
          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
        >
          <SocialIcon platform={link.platform} className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}
