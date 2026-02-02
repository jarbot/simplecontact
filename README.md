# Simple Contact

A configurable contact page built with Next.js, deployable on Vercel.

## Features

- Configurable via YAML file (name, bio, social links, theme)
- Contact form with email notifications via [Resend](https://resend.com)
- reCAPTCHA v3 spam protection (invisible, score-based)
- Rate limiting (5 submissions per hour per IP)
- Dark/light mode based on system preference
- Responsive design with Tailwind CSS
- Social media icons (LinkedIn, GitHub, Twitter, Instagram, and more)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your site

Edit `config/site.yaml` to customize your name, bio, social links, theme, and contact form settings.

### 3. Add your avatar

Place an image file named `avatar.png`, `avatar.jpg`, `avatar.jpeg`, or `avatar.webp` in the `/public` folder. It will be automatically detected.

### 4. Set up environment variables

Create a `.env` file (this file is gitignored and will not be committed):

```bash
touch .env
```

Add your environment variables - see [Environment Variables](#environment-variables) below.

### 5. Run development server

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
bio: "A brief description about yourself"

# Social Links (all optional)
social:
  linkedin: "https://linkedin.com/in/yourprofile"
  github: "https://github.com/yourusername"
  twitter: "https://twitter.com/yourusername"

# Theme (optional - has sensible defaults)
theme:
  primaryColor: "#0070f3"

# Contact Form
contactForm:
  enabled: true
  heading: "Get in Touch"
  description: "I'd love to hear from you"
  successMessage: "Thanks! I'll get back to you soon."
  recaptcha:
    enabled: true
    siteKey: "your-recaptcha-v3-site-key"
```

## Environment Variables

For Vercel deployment, add these in your project settings under **Settings > Environment Variables**.

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) | Yes |
| `CONTACT_EMAIL` | Email address to receive form submissions | Yes |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key | If reCAPTCHA enabled |
| `EMAIL_FROM` | Custom from address (requires verified domain in Resend) | No |

### Setting up Resend

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your Vercel environment variables
4. Add `CONTACT_EMAIL` with your email address

For custom "from" addresses, verify a domain in Resend and set `EMAIL_FROM`.

### Setting up reCAPTCHA v3

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Create a new site and select **reCAPTCHA v3**
3. Add your domains (include `localhost` for development)
4. Copy the **Site Key** to `config/site.yaml` under `contactForm.recaptcha.siteKey`
5. Add the **Secret Key** to your environment variables as `RECAPTCHA_SECRET_KEY`

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial setup"
git push
```

### 2. Deploy to Vercel

1. Import your repository on [Vercel](https://vercel.com/new)
2. Add environment variables in **Settings > Environment Variables**:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `RECAPTCHA_SECRET_KEY` (if using reCAPTCHA)
3. Deploy

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
│   └── lib/
│       ├── config.ts     # YAML config reader
│       ├── email.ts      # Resend email notifications
│       ├── ratelimit.ts  # Rate limiting
│       └── recaptcha.ts  # reCAPTCHA v3 verification
├── package.json
├── tailwind.config.ts
└── vercel.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
