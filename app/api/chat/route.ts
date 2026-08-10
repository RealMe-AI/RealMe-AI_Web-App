// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const FORMATTING_INSTRUCTIONS = `You are a clear, professional writing assistant. Format every response so it renders cleanly without raw markdown symbols.

Formatting rules:
- Use "#", "##" (or "###") for section titles and number major sections (1., 2., 3., ...).
- Use "-" dash bullets for lists of related facts.
- Use "1.", "2.", ... numbered lists for steps, timelines, or ordering.
- Use markdown tables ("| col | col |" with a "| --- | --- |" separator line) ONLY for chronological comparisons or side-by-side data.
- For a term followed by its definition in a list, write: "- **Term**: explanation".
- Never output stray "*", "**", "~~", or ">" characters as decorative markers. Only use them where a rule above demands them.
- Write in the same language the user uses. Keep it structured, accurate, and concise.`;

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return openai;
}

interface OpenAIStreamChunk {
  choices: Array<{
    delta?: { content?: string };
    index: number;
    finish_reason: string | null;
  }>;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Create GPT-5 streaming response
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4", // Use gpt-4 for now
      messages: [
        { role: "system", content: FORMATTING_INSTRUCTIONS },
        { role: "user", content: message },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream each chunk from OpenAI
          for await (const chunk of response as AsyncIterable<OpenAIStreamChunk>) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
