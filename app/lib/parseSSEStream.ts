export type SSEStreamResult = {
  stopped: boolean;
  messageId?: string;
};

export async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (chunk: string) => void,
  onMeta?: (meta: Record<string, unknown>) => void,
): Promise<SSEStreamResult> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6);

      if (data === "[DONE]") break;

      try {
        const parsed = JSON.parse(data);

        if (parsed.type) {
          onMeta?.(parsed);
        } else {
          const chunk =
            parsed.content || parsed.text || parsed.delta?.content || "";
          if (chunk) {
            onChunk(chunk);
          }
        }
        if (parsed.done === true) {
          return {
            stopped: parsed.stopped === true,
            messageId: parsed.messageId as string | undefined,
          };
        }
      } catch {
        onChunk(data);
      }
    }
  }

  return { stopped: false };
}
