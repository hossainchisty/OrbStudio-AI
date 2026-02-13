# OrbStudio AI — The Ultimate AI Creative Suite

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

**OrbStudio AI** is a comprehensive, enterprise-grade AI creative platform designed for photographers, designers, and digital marketers. It leverages state-of-the-art Large Language Models (LLMs) and computer vision to streamline the creative workflow, from conceptualizing product photography to generating high-converting video ad scripts.

---

## 🚀 Key Features

### 🎨 Creative Studio
*   **Product Photography**: Professional lighting and composition guidance for e-commerce and studio shots.
*   **Fashion Photography**: Editorial-grade posing, styling, and aesthetic direction for high-fashion results.
*   **Image-to-Prompt**: Reverse-engineer any image into a high-fidelity AI prompt (Midjourney/Stable Diffusion compatible).
*   **Virtual Try-On**: Visualize clothing and style changes with photorealistic AI precision.
*   **Future Self**: A "Temporal Decryption" experience to visualize future aging and lifestyle changes with a cyberpunk aesthetic.

### 🎥 Media & Production
*   **Video Ads Studio**: End-to-end video ad creation with scriptwriting, visual storyboarding, and model selection (Lite & Pro).
*   **ASMR Video Planner**: Specialized tools for creating sensory-rich ASMR content.
*   **Music Creation**: Generate original music tracks and songs from text descriptions and lyrics.
*   **Speech Synthesis**: Natural-sounding text-to-speech generation in multiple languages.

### 🛠️ Utilities & Enhancements
*   **Image Upscaling**: Restore and upscale images up to 4K resolution using advanced super-resolution.
*   **AI Sticker Generator**: Create unique, high-quality digital stickers from simple text prompts.
*   **Artistic QR Codes**: Generate scannable, visually stunning QR codes blended with artistic styles.

### 🤖 Interactive Companions
*   **Meet Her**: Engage with "Living Characters" (Elara, Sora, Mira) that possess evolving memories and distinct personalities.

### 🏢 Enterprise Platform
*   **Smart Dashboard**: Centralized hub for all creative tools with role-based access control.
*   **Multi-Model Intelligence**: Powered by **Gemini 2.0 Flash** via OpenRouter for rapid, creative reasoning.
*   **Bilingual Interface**: Native support for **English** and **Bangla**.
*   **Secure Infrastructure**: Enterprise-grade authentication (**Clerk**) and scalable database (**Supabase**).

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | [Supabase](https://supabase.com/) |
| **AI Engine** | [OpenRouter](https://openrouter.ai/) (Gemini 2.0 Flash) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Content** | [Marked](https://marked.js.org/) & [DOMPurify](https://github.com/cure53/dompurify) |

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js 20+ 
*   npm / yarn / pnpm
*   Accounts for Clerk, Supabase, and OpenRouter

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hossainchisty/OrbStudio-AI.git
   cd OrbStudio-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and populate it with your credentials:
   ```env
   # AI & API
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```text
├── app/                # Next.js App Router (Pages & API Routes)
├── components/         # Reusable UI Components
├── lib/                # Shared Utilities, Contexts, and Types
├── public/             # Static Assets
├── next.config.ts      # Next.js Configuration
└── tailwind.config.mjs # Tailwind CSS Configuration
```

---

## 📄 License

This project is currently **Private**. All rights reserved.

---

Developed with ❤️ by [hossainchisty](https://github.com/hossainchisty)
