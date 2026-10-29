"use client";

import { useEffect, useRef, useState } from "react";

export function usePwaRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isDev = process.env.NODE_ENV !== "production";
    const scriptUrl = isDev ? "/sw.js?dev=1" : "/sw.js";

    const handleControllerChange = () => {
      if (!reloadingRef.current) return;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    let registration: ServiceWorkerRegistration | undefined;

    const trackWaitingWorker = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(reg.waiting);
      }

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(installing);
          }
        });
      });
    };

    navigator.serviceWorker
      .register(scriptUrl, { scope: "/" })
      .then((reg) => {
        registration = reg;
        trackWaitingWorker(reg);

        if (reg.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(reg.waiting);
        }
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });

    const checkForUpdates = () => {
      if (document.visibilityState === "visible") {
        registration?.update().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", checkForUpdates);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      document.removeEventListener("visibilitychange", checkForUpdates);
    };
  }, []);

  const handleReload = () => {
    if (!waitingWorker) {
      window.location.reload();
      return;
    }

    reloadingRef.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return {
    visible: Boolean(waitingWorker) && !dismissed,
    handleReload,
    handleDismiss,
  };
}
