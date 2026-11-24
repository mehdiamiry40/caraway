import { createElement, type ReactNode } from "react";
import Link from "next/link";

// Blog posts intentionally carry no artwork. Leftover markdown image syntax is
// dropped rather than rendered, so a stray `![alt](src)` in a post can never
// put an image back on the page.
const IMAGE_BLOCK_RE = /^!\[[^\]]*\]\([^)\s]+(?:\s+\d+x\d+)?\)$/;
const ORDERED_LIST_ITEM_RE = /^\s*\d+\.\s+(.+)$/;
const UNORDERED_LIST_ITEM_RE = /^\s*[-*]\s+(.+)$/;
const TABLE_ROW_RE = /^\s*\|(.+)\|\s*$/;
const TABLE_SEPARATOR_RE = /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const LINK_CLASS =
  "font-semibold text-primary underline decoration-primary/50 decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-primary hover:decoration-2";

const BODY_TEXT = "text-[1.0625rem] text-foreground leading-[1.7]";

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let i = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // `![alt](src)` is image syntax, not a link — drop it, bang included.
    const isImage = !!match[5] && text[match.index - 1] === "!";
    if (match.index > lastIndex) {
      const preceding = text.slice(lastIndex, match.index);
      nodes.push(isImage ? preceding.slice(0, -1) : preceding);
    }
    if (isImage) {
      lastIndex = pattern.lastIndex;
      continue;
    }
    if (match[1]) {
      nodes.push(createElement("strong", { key: `${keyPrefix}-s-${i++}` }, match[2]));
    } else if (match[3]) {
      nodes.push(createElement("em", { key: `${keyPrefix}-e-${i++}` }, match[4]));
    } else if (match[5]) {
      const label = match[6];
      const url = match[7];
      if (url.startsWith("/")) {
        nodes.push(
          createElement(
            Link,
            { key: `${keyPrefix}-l-${i++}`, href: url, className: LINK_CLASS },
            label,
          ),
        );
      } else {
        nodes.push(
          createElement(
            "a",
            {
              key: `${keyPrefix}-a-${i++}`,
              href: url,
              target: "_blank",
              rel: "noopener",
              className: LINK_CLASS,
            },
            label,
          ),
        );
      }
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function parseListItem(text: string): { type: "ol" | "ul"; content: string } | null {
  const ordered = text.match(ORDERED_LIST_ITEM_RE);
  if (ordered) return { type: "ol", content: ordered[1] };

  const unordered = text.match(UNORDERED_LIST_ITEM_RE);
  if (unordered) return { type: "ul", content: unordered[1] };

  return null;
}

function parseTableRow(text: string): string[] | null {
  if (!TABLE_ROW_RE.test(text) || TABLE_SEPARATOR_RE.test(text)) return null;
  return text
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

export function renderBlogContent(
  paragraphs: string[],
  opts: { firstParagraphDropCap?: boolean } = {},
): ReactNode[] {
  if (!paragraphs || paragraphs.length === 0) return [];
  const firstIsHeading =
    typeof paragraphs[0] === "string" &&
    (paragraphs[0].startsWith("## ") || paragraphs[0].startsWith("### "));
  const dropCap = (opts.firstParagraphDropCap ?? false) && !firstIsHeading;

  const nodes: ReactNode[] = [];

  for (let i = 0; i < paragraphs.length; i += 1) {
    const raw = paragraphs[i];
    const text = raw ?? "";
    const key = `b-${i}`;

    if (IMAGE_BLOCK_RE.test(text.trim())) continue;

    const firstListItem = parseListItem(text);
    if (firstListItem) {
      const listType = firstListItem.type;
      const items: string[] = [firstListItem.content];

      while (i + 1 < paragraphs.length) {
        const nextText = paragraphs[i + 1] ?? "";
        const nextItem = parseListItem(nextText);
        if (!nextItem || nextItem.type !== listType) break;
        items.push(nextItem.content);
        i += 1;
      }

      nodes.push(
        createElement(
          listType,
          {
            key,
            className:
              listType === "ol"
                ? `list-decimal pl-6 space-y-3 ${BODY_TEXT} mb-7 marker:font-semibold marker:text-primary`
                : `list-ticks !pl-0 !space-y-3.5 ${BODY_TEXT} mb-7`,
          },
          ...items.map((item, itemIndex) =>
            createElement(
              "li",
              { key: `${key}-li-${itemIndex}`, className: listType === "ol" ? "pl-1.5" : undefined },
              ...parseInline(item, `${key}-li-${itemIndex}`),
            ),
          ),
        ),
      );
      continue;
    }

    const headerCells = parseTableRow(text);
    const separator = paragraphs[i + 1] ?? "";
    if (headerCells && TABLE_SEPARATOR_RE.test(separator)) {
      const rows: string[][] = [];
      i += 1;

      while (i + 1 < paragraphs.length) {
        const nextRow = parseTableRow(paragraphs[i + 1] ?? "");
        if (!nextRow) break;
        rows.push(nextRow);
        i += 1;
      }

      nodes.push(
        createElement(
          "div",
          {
            key,
            className:
              "my-8 overflow-x-auto rounded-lg border border-border bg-card",
          },
          createElement(
            "table",
            {
              className:
                "min-w-[34rem] sm:min-w-full divide-y divide-border text-left text-[0.9375rem] sm:text-base",
            },
            createElement(
              "thead",
              { className: "bg-secondary" },
              createElement(
                "tr",
                null,
                ...headerCells.map((cell, cellIndex) =>
                  createElement(
                    "th",
                    {
                      key: `${key}-th-${cellIndex}`,
                      scope: "col",
                      className:
                        "px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap",
                    },
                    ...parseInline(cell, `${key}-th-${cellIndex}`),
                  ),
                ),
              ),
            ),
            createElement(
              "tbody",
              { className: "divide-y divide-border" },
              ...rows.map((row, rowIndex) =>
                createElement(
                  "tr",
                  { key: `${key}-tr-${rowIndex}` },
                  ...row.map((cell, cellIndex) =>
                    createElement(
                      "td",
                      {
                        key: `${key}-td-${rowIndex}-${cellIndex}`,
                        className:
                          "align-top px-4 py-3 text-foreground leading-relaxed",
                      },
                      ...parseInline(cell, `${key}-td-${rowIndex}-${cellIndex}`),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
      continue;
    }

    if (text.startsWith("### ")) {
      const heading = text.slice(4).trim();
      nodes.push(createElement(
        "h3",
        {
          key,
          id: slugify(heading),
          className:
            "text-xl sm:text-[1.375rem] font-bold leading-snug text-primary mt-9 mb-2 scroll-mt-24",
        },
        ...parseInline(heading, key),
      ));
      continue;
    }

    if (text.startsWith("## ")) {
      const heading = text.slice(3).trim();
      nodes.push(createElement(
        "h2",
        {
          key,
          id: slugify(heading),
          className:
            "text-[1.625rem] sm:text-[1.875rem] font-bold leading-[1.2] text-primary mt-12 mb-3 scroll-mt-24",
        },
        ...parseInline(heading, key),
      ));
      continue;
    }

    const isFirstPara = i === 0;
    const paraClass = isFirstPara && dropCap
      ? "first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.85] text-lg sm:text-xl text-foreground leading-[1.75] font-normal mb-8"
      : `${BODY_TEXT} mb-6`;
    nodes.push(createElement("p", { key, className: paraClass }, ...parseInline(text, key)));
  }

  return nodes;
}
