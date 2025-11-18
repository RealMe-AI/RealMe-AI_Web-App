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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not set" }, { status: 500 });
    }

    // Prepare FormData to forward to OpenAI
    const forwardForm = new FormData();
    forwardForm.append("file", file, "recording.webm");
    forwardForm.append("model", "whisper-1");

    let openaiRes: Response;
    try {
      openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          // Do NOT set content-type manually; let browser handle multipart
        },
        body: forwardForm,
      });
    } catch (networkErr) {
      console.error("OpenAI request failed:", networkErr);
      return NextResponse.json({ error: "Failed to connect to OpenAI" }, { status: 502 });
    }

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error("OpenAI API error:", text);
      return NextResponse.json({ error: text || "Whisper API error" }, { status: openaiRes.status });
    }

    let data: OpenAITranscriptionResponse;
    try {
      data = await openaiRes.json();
    } catch (jsonErr) {
      console.error("Failed to parse OpenAI response:", jsonErr);
      return NextResponse.json({ error: "Invalid JSON from Whisper API" }, { status: 502 });
    }

    // Validate data
    if (!data?.text) {
      return NextResponse.json({ error: "Whisper returned no text" }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Server error";
    console.error("Transcription route unexpected error:", err);
    return NextResponse.json({ error }, { status: 500 });
  }
}
