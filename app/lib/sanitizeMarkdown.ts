const LETTER_OR_DIGIT = /\p{L}|\p{N}/u;
const BULLET_LEAD = /^\s*(?:[-+*]\s+|\d{1,3}[.)]\s+)$/;

function isClean(content: string): boolean {
  return content.trim() !== "" && LETTER_OR_DIGIT.test(content);
}

/**
 * Adds a space after a colon (`:` / `：`) when it is directly followed by a
 * letter or digit, fixing the model's "Term:Explanation" concatenation while
 * leaving `://` and existing spacing untouched.
 */
export function normalizeColonSpacing(text: string): string {
  return text.replace(/([:：])(?=[\p{L}\p{N}])/gu, "$1 ");
}

/**
 * Option B sanitization.
 *
 * Walks the string once, pairing `**`/`*` markers:
 *  - **Bullet-lead** `**Term**:` (a clean `**…**` that is the first token right
 *    after a `- ` / `* ` / `+ ` / `1. ` marker) is re-emitted so the term still
 *    renders bold.
 *  - **Mid-sentence** `**X**`/`*X*` is flattened (markers dropped -> plain), so
 *    no literal `*` can reach the screen.
 *  - Dangling / unpaired / whitespace-only markers are also dropped.
 *
 * Backtick-delimited content is copied through untouched.
 */
export default function sanitizeAsterisks(text: string): string {
  if (!text) return text;

  const chars = Array.from(text);
  const len = chars.length;
  const out: string[] = [];

  let inCode = false;
  let i = 0;
  let lineStart = 0; // char index where the current line began

  while (i < len) {
    const ch = chars[i];

    if (ch === "`") {
      out.push(ch);
      inCode = !inCode;
      i++;
      continue;
    }

    if (inCode) {
      out.push(ch);
      i++;
      continue;
    }

    if (ch === "\n") {
      out.push(ch);
      i++;
      lineStart = i;
      continue;
    }

    if (ch !== "*") {
      out.push(ch);
      i++;
      continue;
    }

    const isDouble = chars[i + 1] === "*";

    if (!isDouble) {
      // Single `*` italic: always flatten.
      const openerIndex = i;
      i += 1;

      let j = openerIndex + 1;
      let found = false;
      while (j < len) {
        const c = chars[j];
        if (c === "`") break;
        if (c === "*" && chars[j + 1] !== "*") {
          found = true;
          break;
        }
        j++;
      }
      if (found) {
        out.push(chars.slice(openerIndex + 1, j).join(""));
        i = j + 1;
      } else {
        out.push(chars.slice(i, len).join("").replace(/\*+/g, ""));
        i = len;
      }
      continue;
    }

    // Double `**`: decide bullet-lead vs mid-sentence.
    const openerIndex = i;
    const prefix = chars.slice(lineStart, openerIndex).join("");
    const isBulletLead = BULLET_LEAD.test(prefix);
    i += 2;

    let j = i;
    let found = false;
    while (j < len) {
      const c = chars[j];
      if (c === "`") break;
      if (c === "*" && chars[j + 1] === "*") {
        found = true;
        break;
      }
      j++;
    }

    const content = found ? chars.slice(i, j).join("") : "";

    if (found && isClean(content) && isBulletLead) {
      out.push("**" + content + "**");
      i = j + 2;
    } else if (found) {
      out.push(content);
      i = j + 2;
    } else {
      out.push(chars.slice(i, len).join("").replace(/\*+/g, ""));
      i = len;
    }
  }

  return normalizeColonSpacing(out.join(""));
}