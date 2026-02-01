import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SiteConfig } from '@/types/config';

const configPath = path.join(process.cwd(), 'config', 'site.yaml');

export function getConfig(): SiteConfig {
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContents) as SiteConfig;
  return config;
}

export function getSocialLinks(config: SiteConfig): Array<{ platform: string; url: string; icon: string }> {
  const socialIcons: Record<string, string> = {
    linkedin: 'linkedin',
    github: 'github',
    twitter: 'twitter',
    instagram: 'instagram',
    facebook: 'facebook',
    youtube: 'youtube',
    tiktok: 'tiktok',
    mastodon: 'mastodon',
    bluesky: 'bluesky',
    threads: 'threads',
    website: 'globe',
  };

  const links: Array<{ platform: string; url: string; icon: string }> = [];

  if (config.social) {
    for (const [platform, url] of Object.entries(config.social)) {
      if (url) {
        links.push({
          platform,
          url,
          icon: socialIcons[platform] || 'link',
        });
      }
    }
  }

  return links;
}
