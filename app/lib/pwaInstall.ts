"use client";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export interface PwaInstallState {
  canInstall: boolean;
  isInstalled: boolean;
}

type Listener = () => void;

const listeners = new Set<Listener>();

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;

let snapshot: PwaInstallState = {
  canInstall: false,
  isInstalled: false,
};

const SERVER_SNAPSHOT: PwaInstallState = {
  canInstall: false,
  isInstalled: false,
};

function emit() {
  snapshot = {
    canInstall: deferredPrompt !== null,
    isInstalled: installed,
  };
  listeners.forEach((listener) => listener());
}

function detectStandalone() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

if (typeof window !== "undefined") {
  installed = detectStandalone();
  snapshot = { canInstall: false, isInstalled: installed };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });
}

export function subscribePwaInstall(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPwaInstallSnapshot(): PwaInstallState {
  return snapshot;
}

export function getPwaInstallServerSnapshot(): PwaInstallState {
  return SERVER_SNAPSHOT;
}

export function isIosDevice() {
  if (typeof window === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
}

export async function promptPwaInstall(): Promise<
  "accepted" | "dismissed" | "unavailable"
> {
  if (!deferredPrompt) return "unavailable";

  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  emit();

  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;

  return choice.outcome;
}
