import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // .diff 붙이기
    const diffUrl = `${url}.diff`;

    const res = await fetch(diffUrl, {
        headers: {
            "User-Agent": "Next.js-fetch",
        },
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch diff" }, { status: res.status });
    }

    const text = await res.text();

    return new NextResponse(text, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
