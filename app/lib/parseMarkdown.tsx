import React from "react";
import hljs from "highlight.js";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";

type ParsedSegment =
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "bold"; text: string }
  | { type: "inline-code"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; text: string };

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
    if (codeMatch) {
      if (codeMatch[1]) parts.push(parseInline(codeMatch[1]));
      parts.push(
        <code
          key={key++}
          className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm"
        >
          {codeMatch[2]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(parseInline(boldMatch[1]));
      parts.push(
        <strong key={key++} className="font-bold">
          {boldMatch[2]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // No more patterns found, push remaining text
    parts.push(remaining);
    break;
  }

  return parts;
}

function splitIntoBlocks(text: string): string[] {
  const blocks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const codeBlockMatch = remaining.match(/```(\w*)\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const before = remaining.slice(0, codeBlockMatch.index);
      if (before) blocks.push(before);
      blocks.push(codeBlockMatch[0]);
      remaining = remaining.slice(
        codeBlockMatch.index! + codeBlockMatch[0].length,
      );
    } else {
      blocks.push(remaining);
      break;
    }
  }

  return blocks;
}

function parseBlock(block: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const lines = block.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (shouldn't happen here but handle gracefully)
    if (line.startsWith("```")) {
      i++;
      continue;
    }

    // Heading: # Title
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      segments.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // Unordered list: - item
    if (line.match(/^\s*-\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*-\s+/)) {
        items.push(lines[i].replace(/^\s*-\s+/, ""));
        i++;
      }
      segments.push({ type: "list", ordered: false, items });
      continue;
    }

    // Ordered list: 1. item
    if (line.match(/^\s*\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      segments.push({ type: "list", ordered: true, items });
      continue;
    }

    // Bold line (e.g. **Some Title**)
    if (line.match(/^\*\*.+\*\*$/) && !line.match(/\*\*.*\*\*.*\*\*/)) {
      segments.push({
        type: "bold",
        text: line.replace(/^\*\*(.+)\*\*$/, "$1"),
      });
      i++;
      continue;
    }

    // Plain paragraph (collect consecutive non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^(#{1,6})\s+/) &&
      !lines[i].match(/^\s*-\s+/) &&
      !lines[i].match(/^\s*\d+\.\s+/) &&
      !lines[i].match(/^```/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      segments.push({ type: "paragraph", text: paraLines.join("\n") });
    } else {
      i++;
    }
  }

  return segments;
}

function renderSegments(segments: ParsedSegment[]): React.ReactNode[] {
  return segments.map((seg, idx) => {
    switch (seg.type) {
      case "heading":
        if (seg.level <= 1) {
          return (
            <h1
              key={idx}
              className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white"
            >
              {parseInline(seg.text)}
            </h1>
          );
        }
        return (
          <h2
            key={idx}
            className="text-base font-semibold mt-3 mb-1 text-slate-900 dark:text-white"
          >
            {parseInline(seg.text)}
          </h2>
        );

      case "bold":
        return (
          <p
            key={idx}
            className="font-bold mt-2 mb-1 text-slate-900 dark:text-white"
          >
            {seg.text}
          </p>
        );

      case "inline-code":
        return (
          <code
            key={idx}
            className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm"
          >
            {seg.text}
          </code>
        );

      case "list":
        const ListTag = seg.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={idx}
            className={`my-2 space-y-1 text-sm leading-relaxed ${
              seg.ordered ? "list-decimal" : "list-disc"
            } list-inside text-slate-800 dark:text-slate-200`}
          >
            {seg.items.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ListTag>
        );

      case "paragraph":
        return (
          <p
            key={idx}
            className="text-sm leading-relaxed whitespace-pre-wrap my-1 text-slate-800 dark:text-slate-200"
          >
            {parseInline(seg.text)}
          </p>
        );

      default:
        return null;
    }
  });
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  let highlighted: string;

  if (language && hljs.getLanguage(language)) {
    try {
      highlighted = hljs.highlight(code, { language }).value;
    } catch {
      highlighted = hljs.highlightAuto(code).value;
    }
  } else {
    highlighted = hljs.highlightAuto(code).value;
  }

  return (
    <div className="my-3 rounded-lg overflow-hidden">
      <div className="relative bg-gray-200 dark:bg-slate-700 px-4 py-1 text-xs font-mono text-gray-600 dark:text-gray-300 uppercase">
        <span>{language || "code"}</span>
        <button
          onClick={() => copy(code)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="bg-gray-100 dark:bg-slate-800 p-4 overflow-x-auto">
        <code
          className={`language-${language || "plaintext"} text-sm font-mono leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const blocks = splitIntoBlocks(text);
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const block of blocks) {
    // Code block
    const codeMatch = block.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (codeMatch) {
      elements.push(<CodeBlock key={key++} language={codeMatch[1]} code={codeMatch[2]} />);
      continue;
    }

    // Text block — split by blank lines for paragraph separation
    const paragraphs = block.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      const segments = parseBlock(trimmed);
      elements.push(
        ...renderSegments(segments).map((el) =>
          React.cloneElement(el as React.ReactElement, { key: key++ }),
        ),
      );
    }
  }

  return elements;
}
