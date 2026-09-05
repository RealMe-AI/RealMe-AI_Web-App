import { useState, useEffect, useCallback, useRef } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { fetchConversations } from "@/app/lib/conversations";
import type { PaginatedMeta } from "@/app/interface/type";
import { useDebounce } from "../useDebounce";

interface FetchResult {
  meta: PaginatedMeta | null;
  errorMsg: string | null;
}

// Shared in-flight guard so identical initial fetches (Sidebar +
// ConversationsModal, StrictMode remounts) share ONE request.
const inFlightFetch = new Map<string, Promise<FetchResult>>();

export function useChats() {
  const { chats, setConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshSignal = useChatStore((s) => s.chatsRefreshSignal);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);
  const [hasMore, setHasMore] = useState(false);

  const runFetch = useCallback(
    async (page: number, append: boolean, q: string): Promise<FetchResult> => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const { chats: loadedChats, meta } = await fetchConversations(
          page,
          20,
          q,
        );

        if (meta) {
          totalPagesRef.current = meta.totalPages;
          pageRef.current = meta.page;
          setHasMore(meta.page < meta.totalPages);
        } else {
          setHasMore(false);
        }

        if (append) {
          setConversations((prev) => [...prev, ...loadedChats]);
        } else {
          setConversations(loadedChats);
        }

        setError(null);
        return { meta: meta ?? null, errorMsg: null };
      } catch (err) {
        console.error("Error fetching chats:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch chats";
        setError(errorMsg);
        return { meta: null, errorMsg };
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [setConversations],
  );

  const fetchChats = useCallback(
    async (page: number, append: boolean, q: string) => {
      if (append) {
        await runFetch(page, true, q);
        return;
      }

      const key = `${page}:${q}`;
      const existing = inFlightFetch.get(key);
      if (existing) {
        setIsLoading(true);
        try {
          const { meta, errorMsg } = await existing;
          if (meta) {
            totalPagesRef.current = meta.totalPages;
            pageRef.current = meta.page;
            setHasMore(meta.page < meta.totalPages);
          } else {
            setHasMore(false);
          }
          setError(errorMsg);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      const request = runFetch(page, false, q).finally(() => {
        if (inFlightFetch.get(key) === request) {
          inFlightFetch.delete(key);
        }
      });
      inFlightFetch.set(key, request);
      await request;
    },
    [runFetch],
  );

  // Initial load + refresh signal
  useEffect(() => {
    pageRef.current = 1;
    totalPagesRef.current = 1;
    setHasMore(false);
    setSearchTerm("");
    fetchChats(1, false, "");
  }, [refreshSignal, fetchChats]);

  // Search changes → reset to page 1 (skip the initial mount, which the
  // "Initial load" effect above already handles)
  const didInitSearchRef = useRef(false);
  useEffect(() => {
    if (!didInitSearchRef.current) {
      didInitSearchRef.current = true;
      return;
    }
    pageRef.current = 1;
    totalPagesRef.current = 1;
    setHasMore(false);
    fetchChats(1, false, debouncedSearch);
  }, [debouncedSearch, fetchChats]);

  const debouncedSearchRef = useRef(debouncedSearch);
  debouncedSearchRef.current = debouncedSearch;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      fetchChats(nextPage, true, debouncedSearchRef.current);
    }
  }, [hasMore, isLoadingMore, fetchChats]);

  const refetch = useCallback(() => {
    pageRef.current = 1;
    totalPagesRef.current = 1;
    setHasMore(false);
    setSearchTerm("");
    fetchChats(1, false, "");
  }, [fetchChats]);

  return {
    chats,
    isLoading,
    isLoadingMore,
    error,
    searchTerm,
    setSearchTerm,
    loadMore,
    hasMore,
    refetch,
  };
}