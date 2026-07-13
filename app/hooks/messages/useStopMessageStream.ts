import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useChatStore } from "@/app/store/useChatStore";

export const useStopMessageStream = () => {
  const { setIsLoading, setAbortController } = useChatStore();

  const stopStream = useCallback(async () => {
    const { activeConversationId, abortController } = useChatStore.getState();

    if (activeConversationId) {
      try {
        await authFetch(`${baseUrl}/messages/stream/stop`, {
          method: "POST",
        });
      } catch {
        // Server-side stop is best-effort; client-side abort still works
      }
    }

    if (abortController) {
      abortController.abort();
    }

    setIsLoading(false);
    setAbortController(null);
  }, [setIsLoading, setAbortController]);

  return { stopStream };
};
