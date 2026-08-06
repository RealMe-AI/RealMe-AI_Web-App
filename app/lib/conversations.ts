"use client";

import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import type { Chat, PaginatedMeta } from "@/app/interface/type";

export interface ConversationsPage {
  chats: Chat[];
  meta?: PaginatedMeta;
}

export async function fetchConversations(
  page: number,
  limit: number,
  q: string,
): Promise<ConversationsPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (q) params.set("q", q);

  const res = await authFetch(`${baseUrl}/conversations?${params}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch conversations");
  }

  const json = await res.json();
  const chats = Array.isArray(json)
    ? json
    : json.data || json.items || json.conversations || [];

  return { chats, meta: json.meta };
}