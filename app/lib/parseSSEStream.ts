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
  let messageId: string | undefined;
  let stopped = false;

  const handleData = (data: string): boolean => {
    if (data === "[DONE]") return true;
    try {
      const parsed = JSON.parse(data);
      const seenId =
        (parsed.messageId ??
          parsed.aiMessageId ??
          parsed.assistantMessageId) as string | undefined;
      if (seenId) messageId = seenId;
      if (parsed.stopped === true) stopped = true;
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
        if (parsed.messageId) messageId = parsed.messageId;
        return true;
      }
    } catch {
      onChunk(data);
    }
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      if (handleData(trimmed.slice(6))) {
        return { stopped, messageId };
      }
    }
  }

  const tail = buffer.trim();
  if (tail.startsWith("data: ")) {
    handleData(tail.slice(6));
  }

  return { stopped, messageId };
}
