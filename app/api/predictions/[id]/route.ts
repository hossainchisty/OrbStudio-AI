import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
        return NextResponse.json({ error: 'Token missing' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            const error = await response.json();
            return NextResponse.json({ error: error.detail || "Failed to fetch prediction" }, { status: 500 });
        }

        const prediction = await response.json();
        return NextResponse.json(prediction);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
