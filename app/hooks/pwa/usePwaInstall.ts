"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getPwaInstallServerSnapshot,
  getPwaInstallSnapshot,
  isIosDevice,
  promptPwaInstall,
  subscribePwaInstall,
} from "@/app/lib/pwaInstall";

const subscribeToClient = () => () => {};
const getIsIos = () => isIosDevice();
const getIsNotIos = () => false;

export function usePwaInstall() {
  const state = useSyncExternalStore(
    subscribePwaInstall,
    getPwaInstallSnapshot,
    getPwaInstallServerSnapshot,
  );
  const isIos = useSyncExternalStore(subscribeToClient, getIsIos, getIsNotIos);

  const promptInstall = useCallback(() => promptPwaInstall(), []);

  return {
    ...state,
    isIos,
    promptInstall,
  };
}
