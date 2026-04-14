import { describe, expect, it } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderBlogContent, slugify } from "@/lib/blog-markdown";

function asElement(node: ReactNode): ReactElement {
  if (!isValidElement(node)) {
    throw new Error(`Expected React element, got ${typeof node}`);
  }
  return node;
}

function getChildren(el: ReactElement): ReactNode[] {
  const props = el.props as { children?: ReactNode };
  const children = props.children;
  if (children == null) return [];
  return Array.isArray(children) ? children : [children];
}

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) {
    return flattenText(getChildren(node));
  }
  return "";
}

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation", () => {
    expect(slugify("What's the deal? (really)")).toBe("whats-the-deal-really");
  });
});

describe("renderBlogContent — block-level", () => {
  it("returns an empty array for empty input", () => {
    expect(renderBlogContent([])).toEqual([]);
  });

  it("does not crash on a single empty string", () => {
    const result = renderBlogContent([""]);
    expect(result).toHaveLength(1);
    expect(asElement(result[0]).type).toBe("p");
  });

  it("renders ## as h2 with slugified id", () => {
    const result = renderBlogContent(["## What is a fair offer"]);
    const el = asElement(result[0]);
    expect(el.type).toBe("h2");
    expect((el.props as { id?: string }).id).toBe("what-is-a-fair-offer");
    expect(flattenText(el)).toBe("What is a fair offer");
  });

  it("renders ### as h3 with slugified id", () => {
    const result = renderBlogContent(["### Brisbane suburbs"]);
    const el = asElement(result[0]);
    expect(el.type).toBe("h3");
    expect((el.props as { id?: string }).id).toBe("brisbane-suburbs");
    expect(flattenText(el)).toBe("Brisbane suburbs");
  });

  it("renders plain string as a <p>", () => {
    const result = renderBlogContent(["Just a plain paragraph."]);
    const el = asElement(result[0]);
    expect(el.type).toBe("p");
    expect(flattenText(el)).toBe("Just a plain paragraph.");
  });

  it("only drop-caps the first paragraph when it is actually a paragraph", () => {
    const result = renderBlogContent(
      ["## Heading first", "Then a paragraph."],
      { firstParagraphDropCap: true },
    );
    const heading = asElement(result[0]);
    expect(heading.type).toBe("h2");
    const para = asElement(result[1]);
    expect(para.type).toBe("p");
    const className = (para.props as { className?: string }).className ?? "";
    expect(className).not.toContain("first-letter");
  });

  it("drop-caps the first paragraph when the first item is a paragraph", () => {
    const result = renderBlogContent(["Lead paragraph.", "Second."], {
      firstParagraphDropCap: true,
    });
    const first = asElement(result[0]);
    const className = (first.props as { className?: string }).className ?? "";
    expect(className).toContain("first-letter");
  });

  it("renders ![alt](src) as a figure with a caption", () => {
    const result = renderBlogContent([
      "![A flatbed tow truck](/images/tow-truck-hero.webp 800x800)",
    ]);
    const fig = asElement(result[0]);
    expect(fig.type).toBe("figure");
    const children = getChildren(fig).filter((c) => c != null);
    const caption = children.find(
      (c) => isValidElement(c) && (c as ReactElement).type === "figcaption",
    ) as ReactElement | undefined;
    expect(caption).toBeDefined();
    expect(flattenText(caption!)).toBe("A flatbed tow truck");
  });

  it("parses width and height from ![alt](src WxH)", () => {
    const result = renderBlogContent(["![hero](/img.webp 1600x900)"]);
    const fig = asElement(result[0]);
    const frame = getChildren(fig).find(
      (c) => isValidElement(c) && (c as ReactElement).type === "div",
    ) as ReactElement | undefined;
    expect(frame).toBeDefined();
    const img = getChildren(frame!).find((c) => isValidElement(c)) as
      | ReactElement
      | undefined;
    expect(img).toBeDefined();
    const imgProps = img!.props as { src: string; width: number; height: number };
    expect(imgProps.src).toBe("/img.webp");
    expect(imgProps.width).toBe(1600);
    expect(imgProps.height).toBe(900);
  });
});

describe("renderBlogContent — inline", () => {
  it("parses **bold** into a <strong>", () => {
    const result = renderBlogContent(["This is **bold** text."]);
    const para = asElement(result[0]);
    const children = getChildren(para);
    const strong = children.find(
      (c) => isValidElement(c) && (c as ReactElement).type === "strong",
    ) as ReactElement | undefined;
    expect(strong).toBeDefined();
    expect(flattenText(strong!)).toBe("bold");
  });

  it("parses *italic* into an <em>", () => {
    const result = renderBlogContent(["This is *italic* text."]);
    const para = asElement(result[0]);
    const children = getChildren(para);
    const em = children.find(
      (c) => isValidElement(c) && (c as ReactElement).type === "em",
    ) as ReactElement | undefined;
    expect(em).toBeDefined();
    expect(flattenText(em!)).toBe("italic");
  });

  it("parses an internal link [text](/path) into a Next Link", () => {
    const result = renderBlogContent(["See [our quote](/quote) page."]);
    const para = asElement(result[0]);
    const children = getChildren(para);
    const link = children.find((c) => {
      if (!isValidElement(c)) return false;
      const props = (c as ReactElement).props as { href?: string };
      return typeof props.href === "string" && props.href.startsWith("/");
    }) as ReactElement | undefined;
    expect(link).toBeDefined();
    const linkProps = link!.props as { href: string; target?: string };
    expect(linkProps.href).toBe("/quote");
    expect(linkProps.target).toBeUndefined();
    expect(flattenText(link!)).toBe("our quote");
  });

  it("parses an external link with target=_blank rel=noopener", () => {
    const result = renderBlogContent([
      "Read [the docs](https://example.com) now.",
    ]);
    const para = asElement(result[0]);
    const children = getChildren(para);
    const link = children.find((c) => {
      if (!isValidElement(c)) return false;
      const props = (c as ReactElement).props as { href?: string };
      return props.href === "https://example.com";
    }) as ReactElement | undefined;
    expect(link).toBeDefined();
    expect(link!.type).toBe("a");
    const linkProps = link!.props as {
      href: string;
      target?: string;
      rel?: string;
    };
    expect(linkProps.target).toBe("_blank");
    expect(linkProps.rel).toBe("noopener");
    expect(flattenText(link!)).toBe("the docs");
  });

  it("renders a mixed paragraph with text, bold, and link in order", () => {
    const result = renderBlogContent([
      "Start **middle** then [end](/end).",
    ]);
    const para = asElement(result[0]);
    const children = getChildren(para).filter((c) => c !== "");
    const types = children.map((c) =>
      typeof c === "string"
        ? "text"
        : isValidElement(c)
          ? typeof (c as ReactElement).type === "string"
            ? ((c as ReactElement).type as string)
            : "Link"
          : "?",
    );
    expect(types[0]).toBe("text");
    expect(children[0]).toBe("Start ");
    expect(types).toContain("strong");
    const strongIdx = types.indexOf("strong");
    expect(flattenText(children[strongIdx])).toBe("middle");
    const linkIdx = types.findIndex(
      (t, i) => i > strongIdx && (t === "Link" || t === "a"),
    );
    expect(linkIdx).toBeGreaterThan(strongIdx);
    expect(flattenText(children[linkIdx])).toBe("end");
  });
});
