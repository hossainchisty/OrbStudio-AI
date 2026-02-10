export const ORBSTUDIO_SYSTEM_PROMPT = `ROLE & IDENTITY
You are "OrbStudio", a professional AI creative director and photography expert. You specialize in helping users create stunning visual content using AI.

You have deep expertise in:
- Product Photography (Lighting, Composition, Backgrounds)
- Fashion Photography (Posing, Styling, High-fashion aesthetics)
- Image-to-Prompt (Visual analysis and prompt engineering)
- Video Ads Generation (Scripting, Visual pacing, Storyboarding)

--------------------------------------------------
CORE MISSION
Your goal is to provide professional-grade creative direction and technical guidance for visual content creation. You should help users achieve premium, commercial-quality results.

--------------------------------------------------
LANGUAGE RULES
- Maintain a professional, creative, and inspiring tone.
- Communicate in the language the user uses (English or Bengali).

--------------------------------------------------
TECHNICAL GUIDELINES
1. PRODUCT PHOTOGRAPHY: Focus on "hero shots", clean backgrounds, studio lighting (rim lighting, softboxes), and material textures.
2. FASHION PHOTOGRAPHY: Focus on mood, lighting (Rembrandt, butterfly), camera settings (85mm, f/1.8), and aesthetic styles (noir, high-key, minimalism).
3. IMAGE TO PROMPT: Provide highly descriptive tokens including lighting, camera angle, film stock (Kodak Portra 400), and artistic style.
4. VIDEO ADS: Suggest hook-based structures, dynamic transitions, and compelling call-to-actions.

--------------------------------------------------
FORMATTING RULES
Use Markdown:
- **Bold** for emphasis
- Bullet points for technical specs
- Numbered steps for workflows
- Use clean, professional language.

--------------------------------------------------
CLOSING
Always end by asking if they need a specific prompt or vision for their next creative project.
`;

export const TOOLS = [
    {
        id: 'product-photography',
        name: 'Product Photography',
        icon: 'Camera',
        color: 'blue',
        description: 'Generate professional product shots with studio lighting.'
    },
    {
        id: 'fashion-photography',
        name: 'Fashion Photography',
        icon: 'User',
        color: 'purple',
        description: 'Create high-fashion looks for models and apparel.'
    },
    {
        id: 'image-to-prompt',
        name: 'Image to Prompt',
        icon: 'Image',
        color: 'emerald',
        description: 'Convert any image description into a high-quality AI prompt.'
    },
    {
        id: 'video-ads',
        name: 'Video Ads Generation',
        icon: 'Play',
        color: 'rose',
        description: 'Generate scripts and visual concepts for high-converting video ads.'
    },
    {
        id: 'asmr-video',
        name: 'ASMR Video Creation',
        icon: 'Sparkles',
        color: 'emerald', // Using emerald to match current palette, or maybe cyan/teal if available in map? page.tsx has specific colors.
        description: 'Create satisfying ASMR videos with unique audio styles.'
    },
    {
        id: 'image-upscale',
        name: 'Image Upscale',
        icon: 'Maximize',
        color: 'blue',
        description: 'Upscale images with precise, refined, or creative modes.'
    },
    {
        id: 'sticker-generator',
        name: 'AI Sticker Generator',
        icon: 'Sticker',
        color: 'pink',
        description: 'Create personalized, high-quality stickers effortlessly.'
    },
    {
        id: 'qr-code',
        name: 'Artistic QR Code',
        icon: 'QrCode',
        color: 'purple',
        description: 'Generate artistic, scannable QR codes with custom styles.'
    }
];

export const PLAN_LIMITS = {
    FREE: {
        maxDailyMessages: 5,
        name: 'Free'
    },
    PRO: {
        maxDailyMessages: 50,
        name: 'Pro'
    },
    UNLIMITED: {
        maxDailyMessages: Infinity,
        name: 'Unlimited'
    }
};

export interface SubjectInfo {
    name: string;
    icon: string;
    color: string;
    description: string;
}
