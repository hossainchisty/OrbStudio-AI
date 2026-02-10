import { NextResponse } from 'next/server';

const QR_CODE_MASTER_PROMPT = `You are an expert AI Art Director specializing in Artistic QR Codes and ControlNet adaptations.

Your task is to convert a user's short input or style selection into a highly detailed, professional stable diffusion prompt optimized for QR ControlNet models.

When given a concept, style, or subject, you must:

1. **Analyze the Input**:
   - Identify the core subject, artistic style, and mood.
   - Determine the best visual elements that blend well with QR patterns (high contrast, clear structures).

2. **Generate Professional Prompts**:
   - Create a single, highly descriptive prompt string.
   - Include artistic keywords (e.g., "highly detailed", "8k resolution", "masterpiece").
   - Specify lighting and texture (e.g., "cinematic lighting", "intricate details").
   - Ensure the description supports a scannable QR code (avoid overly chaotic noise).

3. **Output Format**:
   - Provide ONLY the final generation prompt.
   - Do NOT include quotes, explanations, or labels.

Example Input: "Cyberpunk city"
Example Output: futuristic cyberpunk city with neon lights, towering skyscrapers, rain-slicked streets, high contrast, vibrant colors, intricate details, 8k, cinematic lighting, digital art masterpiece`;

export async function POST(req: Request) {
    try {
        const { url, prompt, style } = await req.json();

        if (!url || !prompt) {
            return NextResponse.json(
                { error: 'URL and Prompt are required' },
                { status: 400 }
            );
        }

        const apiToken = process.env.REPLICATE_API_TOKEN;
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        /* Replicate Token Check Removed */

        let enhancedPrompt = prompt;

        // Enhance prompt using LLM if OpenRouter Key is available
        if (openRouterKey) {
            try {
                const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${openRouterKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                        "X-Title": "OrbStudio"
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-001",
                        messages: [
                            {
                                role: "system",
                                content: QR_CODE_MASTER_PROMPT
                            },
                            {
                                role: "user",
                                content: `Style: ${style || 'General'}\nConcept: ${prompt}`
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });

                if (llmResponse.ok) {
                    const data = await llmResponse.json();
                    const aiPrompt = data.choices?.[0]?.message?.content;
                    if (aiPrompt) {
                        enhancedPrompt = aiPrompt.trim();
                    }
                }
            } catch (error) {
                console.error("Prompt Enhancement Failed:", error);
                // Fallback to original prompt is automatic since enhancedPrompt was init to prompt
            }
        }

        let isFallback = false;
        let errorDetail = null;

        if (apiToken) {
            try {
                // Using zylim0702/qr_code_controlnet
                // Version hash: 628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557
                const response = await fetch("https://api.replicate.com/v1/predictions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        version: "628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
                        input: {
                            url: url,
                            prompt: enhancedPrompt,
                            qr_conditioning_scale: 1.1,
                            num_inference_steps: 30,
                            guidance_scale: 7.5,
                            negative_prompt: "ugly, disfigured, low quality, blurry, nsfw, text, watermark"
                        }
                    }),
                });

                if (response.status !== 201) {
                    const error = await response.json();
                    console.error("Replicate API Error:", error);
                    errorDetail = error.detail || error.error || "Replicate API Error";
                    isFallback = true;
                } else {
                    const prediction = await response.json();
                    return NextResponse.json(prediction, { status: 201 });
                }
            } catch (error: any) {
                console.error("Replicate Request Failed:", error);
                errorDetail = error.message;
                isFallback = true;
            }
        } else {
            console.log("REPLICATE_API_TOKEN missing, using fallback");
            isFallback = true;
            errorDetail = "Replicate API Token missing";
        }

        // Generate Standard QR Code (Fallback)
        // Using api.qrserver.com which is free and reliable

        // Map some styles to colors just for a bit of variety (simple hex codes)
        const styleColors: Record<string, string> = {
            'Cartoon': '2563eb', // blue-600
            'Pixel Art': '4f46e5', // indigo-600
            'Illustration': 'db2777', // pink-600
            '3D Render': '059669', // emerald-600
            'Random': '000000',
            'Suburban': '10b981',
            'Mecha': 'ef4444',
            'World Map': 'd97706',
            'Landscape': '65a30d',
            'Mountain': '0ea5e9',
            'Snowy Village': '3b82f6',
            'Alaska': '8b5cf6',
            'Psygnosis': 'ec4899',
            'Picasso': 'f43f5e',
            'Clouds': '06b6d4',
            'Makoto Shinkai': '6366f1',
            'Frozen Island': '3b82f6',
            'Waterfall': '14b8a6',
            'Anime Girl': 'd946ef',
            'Sakura': 'f472b6',
            'Tropical Island': 'f59e0b',
            'Floating Island': '8b5cf6',
            'Cat': 'f97316',
            'Tiger': 'f59e0b'
        };

        const color = styleColors[style] || '000000';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}&color=${color}&margin=10`;

        // Simulate a small delay to make it feel like "processing" (optional, improves UX pacing)
        // Only if we fell back
        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({
            id: "local-" + Date.now(),
            status: "succeeded",
            output: [qrUrl],
            enhanced_prompt: enhancedPrompt,
            is_fallback: isFallback,
            error_detail: errorDetail
        }, { status: 201 });

    } catch (error: any) {
        console.error("QR Generation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
