/**
 * Moves the browser's selection caret to the very end of a
 * contentEditable element after a programmatic textContent change.
 *
 * Setting `.textContent` directly nukes all child nodes and creates a
 * brand-new text node, which leaves the Selection object pointing at a
 * stale/invalid offset. This utility re-anchors the caret correctly.
 */
export function placeCursorAtEnd(el: HTMLElement | null): void {
  if (!el) return;
  el.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Moves the browser's selection caret to the very start of a
 * contentEditable element.  Used after clearing the field on send so
 * the input stays focused and the user can type the next message
 * without clicking again.
 */
export function placeCursorAtStart(el: HTMLElement | null): void {
  if (!el) return;
  el.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}
