import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET request handler for fetching a specific conversation and its messages
 * @param request - NextRequest object
 * @param params - Promise object containing the chat ID
 * @returns - NextResponse object containing the chat and messages
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: profileId } = await supabase.rpc(
            "get_profile_id_only",
            { p_clerk_id: userId }
        );

        if (!profileId) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        // Fetch chat metadata
        const { data: chat, error: chatError } = await supabase
            .from("chats")
            .select("*")
            .eq("id", id)
            .eq("user_id", profileId)
            .single();

        if (chatError || !chat) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        // Fetch messages
        const { data: messages, error: msgError } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", id)
            .order("created_at", { ascending: true });

        if (msgError) {
            return NextResponse.json(
                { error: "Failed to fetch messages" },
                { status: 500 }
            );
        }

        return NextResponse.json({ chat, messages });

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message ?? "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * PATCH request handler for updating a specific conversation
 * @param req - Request object
 * @param params - Promise object containing the chat ID
 * @returns - NextResponse object containing the updated chat
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profileId } = await supabase.rpc('get_profile_id_only', { p_clerk_id: userId });
        if (!profileId) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

        const body = await req.json();
        const { title, is_pinned } = body;

        const updates: any = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (is_pinned !== undefined) updates.is_pinned = is_pinned;

        const { data, error } = await supabase
            .from('chats')
            .update(updates)
            .eq('id', id)
            .eq('user_id', profileId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE request handler for deleting a specific conversation
 * @param req - Request object
 * @param params - Promise object containing the chat ID
 * @returns - NextResponse object containing the deleted chat
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profileId } = await supabase.rpc('get_profile_id_only', { p_clerk_id: userId });
        if (!profileId) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', id)
            .eq('user_id', profileId);

        if (error) {
            return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
