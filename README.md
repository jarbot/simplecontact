# Simple Contact

A configurable contact page built with Next.js, deployable on Vercel.

## Features

- Configurable via YAML file (name, bio, social links, theme)
- Contact form with reCAPTCHA spam protection
- SQLite database for storing submissions
- Support for SSG and SSR deployment
- Responsive design with Tailwind CSS
- Social media icons (LinkedIn, GitHub, Twitter, Instagram, and more)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your site

Edit `config/site.yaml` to customize:

- Your name, title, and bio
- Social media links
- Theme colors
- Contact form settings
- reCAPTCHA site key

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Add your reCAPTCHA secret key to `.env`:

```
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

### Site Configuration (`config/site.yaml`)

```yaml
# Personal Information
name: "Your Name"
title: "Your Title"
bio: "A brief description"
email: "contact@example.com"
avatar: "/avatar.jpg"  # Place image in /public folder

# Social Links
social:
  linkedin: "https://linkedin.com/in/yourprofile"
  github: "https://github.com/yourusername"
  twitter: "https://twitter.com/yourusername"
  # Add more as needed

# Theme
theme:
  primaryColor: "#0070f3"
  backgroundColor: "#ffffff"
  textColor: "#333333"

# Contact Form
contactForm:
  enabled: true
  heading: "Get in Touch"
  description: "Send me a message!"
  successMessage: "Thanks! I'll get back to you soon."
  recaptcha:
    enabled: true
    siteKey: "your-site-key"
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v2 secret key | Yes (if reCAPTCHA enabled) |

### Getting reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2 "I'm not a robot"
3. Add your domains (including `localhost` for development)
4. Copy the **Site Key** to `config/site.yaml`
5. Copy the **Secret Key** to your environment variables

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial setup"
git push
```

### 2. Deploy to Vercel

1. Import your repository on [Vercel](https://vercel.com/new)
2. Add environment variable:
   - Key: `RECAPTCHA_SECRET_KEY`
   - Value: Your reCAPTCHA secret key
3. Deploy

### SQLite on Vercel

The SQLite database is stored in `/tmp` on Vercel serverless functions. This means:
- Data persists during warm function instances
- Data may be lost when functions cold start

For production with persistent data, consider:
- Using a cloud database (Vercel Postgres, PlanetScale, etc.)
- Setting up a webhook to forward submissions to your email
- Exporting data periodically

## Supported Social Platforms

- LinkedIn
- GitHub
- Twitter/X
- Instagram
- Facebook
- YouTube
- TikTok
- Mastodon
- Bluesky
- Threads
- Custom website

## Project Structure

```
simplecontact/
├── config/
│   └── site.yaml         # Site configuration
├── data/
│   └── contacts.db       # SQLite database (local dev)
├── public/               # Static assets (avatar, etc.)
├── src/
│   ├── app/
│   │   ├── api/contact/  # Contact form API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ContactForm.tsx
│   │   ├── SocialIcon.tsx
│   │   └── SocialLinks.tsx
│   ├── lib/
│   │   ├── config.ts     # YAML config reader
│   │   ├── db.ts         # SQLite database
│   │   └── recaptcha.ts  # reCAPTCHA verification
│   └── types/
│       └── config.ts     # TypeScript types
├── .env.example
├── package.json
├── tailwind.config.ts
└── vercel.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:setup` - Initialize database

## License

MIT
