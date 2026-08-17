const CLIPBOARD_DISMISS_KEY = "realme:dismissedClipboard";
const CLIPBOARD_DISMISS_MAX = 50;

export function getDismissedClipboard(): Set<string> {
  try {
    const raw = sessionStorage.getItem(CLIPBOARD_DISMISS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function dismissClipboard(key: string) {
  try {
    const set = getDismissedClipboard();
    set.add(key);
    if (set.size > CLIPBOARD_DISMISS_MAX) {
      const oldest = set.values().next().value as string | undefined;
      if (oldest !== undefined) set.delete(oldest);
    }
    sessionStorage.setItem(CLIPBOARD_DISMISS_KEY, JSON.stringify([...set]));
  } catch {
    // Best-effort persistence
  }
}