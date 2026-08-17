import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";

// ---- Bounded in-memory blob cache (LRU by insertion order) ----
const CACHE_MAX = 20;
const blobCache = new Map<string, Blob>();
const inflight = new Set<string>();

async function downloadToBlob(audioUrl: string): Promise<Blob | null> {
  try {
    const res = await fetch(audioUrl);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

function cacheBlob(messageId: string, blob: Blob) {
  if (blobCache.has(messageId)) return;
  blobCache.set(messageId, blob);
  while (blobCache.size > CACHE_MAX) {
    const oldestKey = blobCache.keys().next().value as string | undefined;
    if (oldestKey === undefined) break;
    blobCache.delete(oldestKey);
  }
}

export async function prefetchAudio(messageId: string): Promise<void> {
  if (blobCache.has(messageId) || inflight.has(messageId)) return;

  inflight.add(messageId);
  try {
    const res = await authFetch(
      `${baseUrl}/tts/messages/${messageId}/speak`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    );
    if (!res.ok) return;

    const { audioUrl } = await res.json();
    if (!audioUrl) return;

    const blob = await downloadToBlob(audioUrl);
    if (blob) cacheBlob(messageId, blob);
  } catch {
    // Best-effort prefetch; failures are ignored and playback falls back.
  } finally {
    inflight.delete(messageId);
  }
}

export function getCachedBlob(messageId: string): Blob | undefined {
  return blobCache.get(messageId);
}

export async function cacheAudio(
  messageId: string,
  audioUrl: string,
): Promise<boolean> {
  const blob = await downloadToBlob(audioUrl);
  if (blob) {
    cacheBlob(messageId, blob);
    return true;
  }
  return false;
}