"use client";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsub = useAuthStore.persist.onFinishHydration(onStoreChange);
      return unsub;
    },
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
