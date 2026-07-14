import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useChatStore } from "@/app/store/useChatStore";

export const useStopMessageStream = () => {
  const { setIsLoading, setAbortController } = useChatStore();

  const stopStream = useCallback(() => {
    const { activeConversationId, abortController } = useChatStore.getState();

    // 1. Abort immediately — closes the SSE connection client-side for instant UI feedback
    if (abortController) {
      abortController.abort();
    }

    // 2. Fire server stop in background (fire-and-forget) — backend saves partial response
    if (activeConversationId) {
      authFetch(`${baseUrl}/messages/stream/stop`, {
        method: "POST",
      }).catch(() => {});
    }

    setIsLoading(false);
    setAbortController(null);
  }, [setIsLoading, setAbortController]);

  return { stopStream };
};
