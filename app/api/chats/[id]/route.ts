import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get profile id
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Delete chat (cascading should handle messages if configured, 
        // otherwise delete messages first)
        const { error: msgError } = await supabase
            .from('messages')
            .delete()
            .eq('chat_id', id);

        if (msgError) console.error("Error deleting messages:", msgError);

        const { error: chatError } = await supabase
            .from('chats')
            .delete()
            .eq('id', id)
            .eq('user_id', profile.id);

        if (chatError) throw chatError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
