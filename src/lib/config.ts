import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import crypto from 'crypto';
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

/**
 * Get the avatar URL
 * Priority: 1. Direct avatar path/URL 2. Auto-detect in public folder 3. Gravatar 4. null
 */
export function getAvatarUrl(config: SiteConfig): string | null {
  // If direct avatar is provided, use it
  if (config.avatar) {
    return config.avatar;
  }

  // Auto-detect avatar in public folder (supports png, jpg, jpeg, webp)
  const publicDir = path.join(process.cwd(), 'public');
  const avatarExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  for (const ext of avatarExtensions) {
    const avatarPath = path.join(publicDir, `avatar.${ext}`);
    if (fs.existsSync(avatarPath)) {
      return `/avatar.${ext}`;
    }
  }

  // If gravatarEmail is provided, generate Gravatar URL
  if (config.gravatarEmail) {
    const hash = crypto
      .createHash('md5')
      .update(config.gravatarEmail.toLowerCase().trim())
      .digest('hex');
    // d=404 returns 404 if no gravatar, size=400 for high quality
    return `https://www.gravatar.com/avatar/${hash}?s=400&d=404`;
  }

  return null;
}
