export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  mastodon?: string;
  bluesky?: string;
  threads?: string;
  website?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  darkMode: boolean;
}

export interface RecaptchaConfig {
  enabled: boolean;
  siteKey: string;
}

export interface ContactFormConfig {
  enabled: boolean;
  heading: string;
  description: string;
  successMessage: string;
  recaptcha: RecaptchaConfig;
}

export interface SEOConfig {
  title: string;
  description: string;
  ogImage?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  email: string;
  avatar?: string;
  social: SocialLinks;
  theme: ThemeConfig;
  contactForm: ContactFormConfig;
  seo: SEOConfig;
}
