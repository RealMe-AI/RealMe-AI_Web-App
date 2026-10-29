"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useParams, usePathname } from "next/navigation";
import { useHydrated } from "@/app/hooks/pwa/useHydrated";
import { usePwaInstall } from "./usePwaInstall";

type PromptPosition = { x: number; y: number };

const POSITION_KEY = "realme:pwa-install-position";
const LEGACY_CORNER_KEY = "realme:pwa-install-corner";
const DISMISS_KEY = "realme:pwa-install-dismissed-at";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DRAG_MARGIN = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function inset(side: "top" | "right" | "bottom" | "left") {
  return `calc(1rem + env(safe-area-inset-${side}, 0px))`;
}

export function useInstallAppPrompt() {
  const params = useParams();
  const fullPath = usePathname();

  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;

  const pathname = useMemo(() => {
    if (!fullPath) return "/";
    if (!locale) return fullPath;
    const stripped = fullPath.replace(new RegExp(`^/${locale}(?=/|$)`), "");
    return stripped || "/";
  }, [fullPath, locale]);

  const isLanding = pathname === "/";
  const isDashboard = pathname === "/d" || pathname.startsWith("/d/");
  const eligibleRoute = isLanding || isDashboard;

  const { canInstall, isInstalled, isIos, promptInstall } = usePwaInstall();

  const mounted = useHydrated();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;

    try {
      const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY));
      return (
        Number.isFinite(dismissedAt) &&
        dismissedAt > 0 &&
        Date.now() - dismissedAt < DISMISS_TTL_MS
      );
    } catch {
      return false;
    }
  });
  const [position, setPosition] = useState<PromptPosition | null>(null);
  const positionRef = useRef<PromptPosition | null>(position);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
  } | null>(null);

  const updatePosition = useCallback((next: PromptPosition | null) => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  const visible =
    mounted &&
    eligibleRoute &&
    !isInstalled &&
    !dismissed &&
    (canInstall || isIos);

  useEffect(() => {
    try {
      window.localStorage.removeItem(POSITION_KEY);
      window.localStorage.removeItem(LEGACY_CORNER_KEY);
    } catch {
      // storage can be unavailable in private mode
    }

    const handleResize = () => {
      const card = cardRef.current;
      const current = positionRef.current;
      if (!card || !current) return;

      const rect = card.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;
      const minX = halfWidth + DRAG_MARGIN;
      const maxX = Math.max(minX, window.innerWidth - halfWidth - DRAG_MARGIN);
      const minY = halfHeight + DRAG_MARGIN;
      const maxY = Math.max(
        minY,
        window.innerHeight - halfHeight - DRAG_MARGIN,
      );

      const next = {
        x: clamp(current.x * window.innerWidth, minX, maxX) / window.innerWidth,
        y:
          clamp(current.y * window.innerHeight, minY, maxY) /
          window.innerHeight,
      };

      if (next.x !== current.x || next.y !== current.y) {
        updatePosition(next);
      }
    };

    const frame = window.requestAnimationFrame(handleResize);

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [updatePosition, visible]);

  const positionStyle: CSSProperties = position
    ? {
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }
    : {
        bottom: inset("bottom"),
        left: inset("left"),
      };

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // storage can be unavailable in private mode
    }
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosHelp((value) => !value);
      return;
    }

    await promptInstall();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select")) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (!positionRef.current) {
      updatePosition({
        x: centerX / window.innerWidth,
        y: centerY / window.innerHeight,
      });
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerX,
      centerY,
      width: rect.width,
      height: rect.height,
    };

    card.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const halfWidth = drag.width / 2;
    const halfHeight = drag.height / 2;
    const minX = halfWidth + DRAG_MARGIN;
    const maxX = Math.max(minX, window.innerWidth - halfWidth - DRAG_MARGIN);
    const minY = halfHeight + DRAG_MARGIN;
    const maxY = Math.max(minY, window.innerHeight - halfHeight - DRAG_MARGIN);

    const centerX = clamp(
      drag.centerX + (event.clientX - drag.startX),
      minX,
      maxX,
    );
    const centerY = clamp(
      drag.centerY + (event.clientY - drag.startY),
      minY,
      maxY,
    );

    updatePosition({
      x: centerX / window.innerWidth,
      y: centerY / window.innerHeight,
    });
  };

  const releaseDrag = (pointerId: number) => {
    const card = cardRef.current;
    if (card?.hasPointerCapture(pointerId)) {
      card.releasePointerCapture(pointerId);
    }

    dragStartRef.current = null;
    setIsDragging(false);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    releaseDrag(event.pointerId);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    releaseDrag(event.pointerId);
  };

  return {
    visible,
    isDragging,
    isIos,
    showIosHelp,
    cardRef,
    positionStyle,
    handleInstall,
    handleDismiss,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerCancel,
    },
  };
}
