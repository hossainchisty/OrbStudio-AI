# OrbStudio - AI Creative Director

OrbStudio is a powerful, professional AI-driven creative assistant designed to help photographers and designers create stunning visual content.

## Features
- **Intelligent AI**: Powered by **Gemini 2.0 Flash** via OpenRouter for high-quality creative reasoning.
- **Product Photography**: Expert guidance on lighting, composition, and styling for hero shots.
- **Fashion Photography**: Posing ideas, aesthetic styles, and technical camera settings.
- **Image-to-Prompt**: Advanced visual analysis to generate high-quality AI prompts.
- **Video Ads**: Compelling scripts and visual pacing for high-converting ads.
- **Bilingual Support**: Support for both **English** and **Bangla**.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Formatting**: [Marked](https://marked.js.org/) & [DOMPurify](https://github.com/cure53/dompurify)
- **Auth**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **LLM API**: [OpenRouter](https://openrouter.ai/) (Model: `google/gemini-2.0-flash-001`)

## Configuration

Create a `.env.local` file in the root directory and add your keys:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
