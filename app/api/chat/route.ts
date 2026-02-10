import { ORBSTUDIO_SYSTEM_PROMPT } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * POST request handler for creating a new conversation
 * @param req - Request object
 * @returns - NextResponse object containing the new conversation
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress || "";
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";

        const { message, subject, conversation_id, image } = await req.json();

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, subscription_tier, daily_usage_count, last_usage_date')
            .eq('clerk_id', userId)
            .single();

        let profileId = profileData?.id;

        const { data: syncedId, error: rpcError } = await supabase
            .rpc('get_profile_id_by_clerk_id', {
                p_clerk_id: userId,
                p_email: email,
                p_first_name: firstName,
                p_last_name: lastName
            });

        if (rpcError || !syncedId) {
            console.error("Profile Sync Error:", rpcError);
            return NextResponse.json({ error: "User profile sync failed." }, { status: 500 });
        }

        profileId = syncedId;

        const { PLAN_LIMITS } = await import('@/lib/constants');

        let tier = 'FREE';
        let currentUsage = 0;
        let lastDate = '';

        if (profileData) {
            tier = profileData.subscription_tier;
            currentUsage = profileData.daily_usage_count;
            lastDate = profileData.last_usage_date;
        } else {
            const { data: newData } = await supabase
                .from('profiles')
                .select('subscription_tier, daily_usage_count, last_usage_date')
                .eq('id', profileId)
                .single();
            if (newData) {
                tier = newData.subscription_tier;
                currentUsage = newData.daily_usage_count;
                lastDate = newData.last_usage_date;
            }
        }

        const plan = (tier as keyof typeof PLAN_LIMITS) || 'FREE';
        const limit = PLAN_LIMITS[plan].maxDailyMessages;

        const todayStr = new Date().toISOString().split('T')[0];

        if (lastDate !== todayStr) {
            currentUsage = 0;
        }

        if (currentUsage >= limit) {
            return NextResponse.json({ error: `Daily limit reached for ${PLAN_LIMITS[plan].name} plan. Please upgrade to continue.` }, { status: 403 });
        }

        await supabase.from('profiles').update({
            daily_usage_count: currentUsage + 1,
            last_usage_date: todayStr
        }).eq('id', profileId);

        let chatId = conversation_id;
        if (!chatId) {
            const { data: newChat, error: chatError } = await supabase
                .from('chats')
                .insert({
                    user_id: profileId,
                    title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                    subject: subject || 'General'
                })
                .select()
                .single();

            if (chatError) {
                console.error("Chat Creation Error:", chatError);
                throw new Error("Failed to create conversation");
            }
            chatId = newChat.id;
        }
        const { error: msgError } = await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'user',
            content: message,
            image: image
        });

        if (msgError) {
            console.error("Message Save Error:", msgError);
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenRouter API Key not configured on server" },
                { status: 500 }
            );
        }

        // Fashion Photography Master Prompt
        const fashionMasterPrompt = `You are an expert AI fashion photography director and virtual try-on specialist.

Your role is to create professional, high-fidelity prompts for AI fashion generation and virtual styling.

When given fashion photography requests with model images, garment images, and styling preferences, you must:

1. **Analyze the Input**:
   - Assess the model's pose, lighting, and characteristics
   - Evaluate garment style, fabric, color, and texture
   - Consider the desired aesthetic (street style, editorial, commercial, etc.)

2. **Generate Professional Prompts**:
   - Create detailed, technical prompts that include:
     * Precise camera specifications (e.g., "85mm lens, f/1.8 aperture, ISO 100")
     * Lighting setup (e.g., "Rembrandt lighting with soft key light, rim light for depth")
     * Pose and composition details
     * Garment integration instructions
     * Background and environment specifications
     * Color grading and mood descriptors

3. **Output Format**:
   - Provide ONLY the final generation prompt
   - Make it concise but highly descriptive
   - Focus on visual and technical accuracy
   - Ensure seamless garment-to-model integration

Example Output:
"High-fashion editorial portrait of a female model wearing [garment description], shot with 85mm lens at f/1.8, Rembrandt lighting setup with soft key light from 45°, professional studio backdrop in neutral grey, natural pose with confident expression, editorial magazine quality, 4K resolution, sharp focus on fabric texture and draping."

Always respond with ONLY the prompt text, no explanations or meta-commentary.`;

        const toolContext = subject === 'fashion-photography'
            ? fashionMasterPrompt
            : `\n\nCONTEXT: Tool: ${subject}.`;
        const systemPrompt = subject === 'fashion-photography'
            ? fashionMasterPrompt
            : ORBSTUDIO_SYSTEM_PROMPT + toolContext;

        const model = subject === 'fashion-photography'
            ? "nanobanana/nanobanana:free"
            : "google/gemini-2.0-flash-001";

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "OrbStudio"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: image ? [
                            { type: "text", text: message || "Analyze this image." },
                            { type: "image_url", image_url: { url: image } }
                        ] : message
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenRouter API Error:", errorData);
            throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "দুঃখিত, আমি উত্তর দিতে পারছি না। অনুগ্রহ করে আবার চেষ্টা করুন।";

        // Save Assistant Message
        await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'assistant',
            content: text
        });

        return NextResponse.json({ text, conversation_id: chatId });
    } catch (error: any) {
        console.error("Chat API Detailed Error:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            name: error.name
        });
        return NextResponse.json(
            { error: "Failed to generate response: " + error.message },
            { status: 500 }
        );
    }
}
