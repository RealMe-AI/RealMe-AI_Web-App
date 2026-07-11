export async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (chunk: string) => void,
): Promise<void> {
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
        const chunk =
          parsed.content || parsed.text || parsed.delta?.content || "";
        if (chunk) {
          onChunk(chunk);
        }
      } catch {
        onChunk(data);
      }
    }
  }
}
