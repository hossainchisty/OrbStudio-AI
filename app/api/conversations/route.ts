import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET request handler for fetching all conversations
 * @param req - Request object
 * @returns - NextResponse object containing the conversations
 */
export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Resolve Profile ID
        const { data: profileId, error: profileError } = await supabase
            .rpc('get_profile_id_only', { p_clerk_id: userId });

        if (profileError || !profileId) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const subject = searchParams.get('subject');

        let query = supabase
            .from('chats')
            .select('*')
            .eq('user_id', profileId)
            .order('is_pinned', { ascending: false })
            .order('updated_at', { ascending: false });

        if (subject) {
            query = query.eq('subject', subject);
        }

        const { data: chats, error } = await query;

        if (error) {
            console.error("Fetch Chats Error:", error);
            // Don't expose internal error
            return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
        }

        return NextResponse.json(chats);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
