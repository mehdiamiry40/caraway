import { createElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const IMAGE_BLOCK_RE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+(\d+)x(\d+))?\)$/;
const ORDERED_LIST_ITEM_RE = /^\s*\d+\.\s+(.+)$/;
const UNORDERED_LIST_ITEM_RE = /^\s*[-*]\s+(.+)$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const LINK_CLASS =
  "text-primary underline underline-offset-2 hover:text-accent transition-colors";

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let i = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
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
                ? "list-decimal pl-5 sm:pl-6 space-y-3 text-base sm:text-lg text-foreground/85 leading-[1.75] mb-7"
                : "list-disc pl-5 sm:pl-6 space-y-3 text-base sm:text-lg text-foreground/85 leading-[1.75] mb-7",
          },
          ...items.map((item, itemIndex) =>
            createElement(
              "li",
              { key: `${key}-li-${itemIndex}`, className: "pl-1" },
              ...parseInline(item, `${key}-li-${itemIndex}`),
            ),
          ),
        ),
      );
      continue;
    }

    const imgMatch = text.trim().match(IMAGE_BLOCK_RE);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      const width = imgMatch[3] ? Number(imgMatch[3]) : 1600;
      const height = imgMatch[4] ? Number(imgMatch[4]) : 900;
      nodes.push(createElement(
        "figure",
        { key, className: "my-10" },
        createElement(
          "div",
          {
            key: `${key}-frame`,
            className:
              "relative overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm",
          },
          createElement(Image, {
            src,
            alt,
            width,
            height,
            sizes: "(max-width: 768px) 100vw, 720px",
            className: "h-auto w-full object-cover",
          }),
        ),
        alt
          ? createElement(
              "figcaption",
              {
                key: `${key}-cap`,
                className:
                  "mt-3 text-center text-xs sm:text-sm text-muted-foreground italic",
              },
              alt,
            )
          : null,
      ));
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
            "font-display text-xl sm:text-2xl text-foreground mt-10 mb-4 scroll-mt-24",
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
            "font-display text-2xl sm:text-3xl text-primary mt-12 mb-5 scroll-mt-24",
        },
        ...parseInline(heading, key),
      ));
      continue;
    }

    const isFirstPara = i === 0;
    const paraClass = isFirstPara && dropCap
      ? "first-letter:font-display first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.85] text-lg sm:text-xl text-foreground leading-[1.75] font-normal mb-8"
      : "text-base sm:text-lg text-foreground/85 leading-[1.85] mb-7";
    nodes.push(createElement("p", { key, className: paraClass }, ...parseInline(text, key)));
  }

  return nodes;
}
