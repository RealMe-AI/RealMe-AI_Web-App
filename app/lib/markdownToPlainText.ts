const INLINE_TOKEN = /(`[^`]+`)|(\*\*(.+?)\*\*)|(\*([^*\n]+)\*)|(~~(.+?)~~)|\[([^\]]+)\]\([^)]*\)/g;

function normalizeColonSpacing(text: string): string {
  return text.replace(/([:：])(?=[\p{L}\p{N}])/gu, "$1 ");
}

function stripInline(text: string): string {
  const out: string[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_TOKEN)) {
    const index = match.index ?? 0;
    const code = match[1] !== undefined ? match[1].slice(1, -1) : undefined;
    const bold = match[3];
    const italic = match[5];
    const strike = match[7];
    const link = match[8];

    if (index > lastIndex) out.push(text.slice(lastIndex, index));
    if (code !== undefined) out.push(code);
    else if (bold !== undefined && bold.trim() !== "") out.push(bold);
    else if (italic !== undefined && italic.trim() !== "") out.push(italic);
    else if (strike !== undefined && strike.trim() !== "") out.push(strike);
    else if (link !== undefined && link.trim() !== "") out.push(link);

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) out.push(text.slice(lastIndex));

  return out
    .join("")
    .replace(/\*+/g, "")
    .replace(/^\s*>\s?/gm, "");
}

export default function markdownToPlainText(text: string): string {
  if (!text) return "";

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inCode = false;
  let inTableHeader = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Toggle code fences; keep content inside
    if (/^```/.test(trimmed)) {
      inCode = !inCode;
      continue;
    }

    // Table separator row (e.g. | --- | --- |)
    if (/^\|[\s:\-|]+\|$/.test(trimmed)) {
      inTableHeader = false;
      continue;
    }

    // Table row
    if (trimmed.startsWith("|")) {
      const cells = trimmed
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => stripInline(c.trim()))
        .filter(Boolean);
      if (cells.length === 0) continue;
      if (inTableHeader) {
        out.push(cells.join(" — "));
        inTableHeader = false;
        continue;
      }
      if (cells.length === 2) {
        out.push(`${cells[0]}: ${cells[1]}`);
      } else {
        out.push(cells.join(" | "));
      }
      continue;
    }

    if (inCode) {
      out.push(stripInline(line));
      continue;
    }

    // Heading
    if (/^#{1,6}\s+/.test(trimmed)) {
      out.push(stripInline(trimmed.replace(/^#{1,6}\s+/, "")));
      continue;
    }

    // Bullets / numbered lists — preserve structure
    const bulletMatch = trimmed.match(/^\s*[-*+]\s+(.+)$/);
    if (bulletMatch) {
      out.push(`- ${stripInline(bulletMatch[1])}`);
      continue;
    }
    const numMatch = trimmed.match(/^\s*\d+[.)]\s+(.+)$/);
    if (numMatch) {
      out.push(stripInline(`${trimmed.match(/^\s*\d+[.)]\s+/)![0].trim()} ${numMatch[1]}`));
      continue;
    }

    out.push(stripInline(line.trim()));
  }

  return normalizeColonSpacing(
    out.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
  );
}