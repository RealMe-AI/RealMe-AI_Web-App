// src/app/api/transcribe/route.ts
import { NextResponse } from "next/server";

interface OpenAITranscriptionResponse {
  text: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Build new FormData to forward to OpenAI
    const forwardForm = new FormData();
    forwardForm.append("file", file, "recording.webm");
    forwardForm.append("model", "whisper-1");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        // content-type must NOT be set manually
      },
      body: forwardForm,
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return NextResponse.json({ error: text || "Whisper error" }, { status: openaiRes.status });
    }

    const data: OpenAITranscriptionResponse = await openaiRes.json();
    return NextResponse.json(data);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Server error";
    console.error("Transcription route error:", err);
    return NextResponse.json({ error }, { status: 500 });
  }
}
