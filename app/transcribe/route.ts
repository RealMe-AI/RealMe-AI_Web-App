// src/app/api/transcribe/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Build new FormData to forward to OpenAI
    const forwardForm = new FormData();
    // Convert browser Blob to Node-friendly Blob is usually fine in Next route environment
    forwardForm.append("file", file, "recording.webm");
    forwardForm.append("model", "whisper-1");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
        // DO NOT set content-type here — fetch will set the multipart boundary automatically
      },
      body: forwardForm as any, // keep types flexible for runtime
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return NextResponse.json({ error: text || "Whisper error" }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    // expected shape: { text: "transcribed text" }
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Transcription route error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
