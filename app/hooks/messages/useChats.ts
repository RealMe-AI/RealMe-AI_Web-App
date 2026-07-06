import { useState, useEffect, useCallback, useRef } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { useDebounce } from "../useDebounce";

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

  const fetchChats = useCallback(
    async (page: number, append: boolean, q: string) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (q) params.set("q", q);

        const res = await authFetch(`${baseUrl}/conversations?${params}`, {
          method: "GET",
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch conversations",
          );
        }

        const json = await res.json();

        const loadedChats = Array.isArray(json)
          ? json
          : json.data || json.items || json.conversations || [];

        const meta = json.meta;
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
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch chats",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [setConversations],
  );

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Initial load + refresh signal
  useEffect(() => {
    pageRef.current = 1;
    totalPagesRef.current = 1;
    setHasMore(false);
    setSearchTerm("");
    fetchChats(1, false, "");
  }, [refreshSignal, fetchChats]);

  // Search changes → reset to page 1
  useEffect(() => {
    if (!isMountedRef.current) return;
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
