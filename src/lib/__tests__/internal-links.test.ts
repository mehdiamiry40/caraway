import { describe, expect, it } from "vitest";
import {
  analyze,
  extractLinks,
  internalPath,
  isNoindex,
  redirectStatusFromMeta,
  routeForFile,
} from "../../../scripts/check-internal-links.mjs";

type Page = { links: Set<string>; noindex: boolean };
const page = (links: string[], noindex = false): Page => ({
  links: new Set(links),
  noindex,
});

describe("routeForFile", () => {
  it("maps built artifacts back onto their routes", () => {
    expect(routeForFile("index.html")).toBe("/");
    expect(routeForFile("about.html")).toBe("/about");
    expect(routeForFile("blog/category/guides.html")).toBe(
      "/blog/category/guides",
    );
  });
});

describe("internalPath", () => {
  it("normalises internal hrefs and rejects external ones", () => {
    expect(internalPath("/about")).toBe("/about");
    expect(internalPath("https://caraway.au/about")).toBe("/about");
    expect(internalPath("https://caraway.au")).toBe("/");
    expect(internalPath("https://example.com/about")).toBeNull();
    expect(internalPath("mailto:info@caraway.au")).toBeNull();
    expect(internalPath("#section")).toBeNull();
  });

  it("collapses fragments, queries and trailing slashes onto one document", () => {
    expect(internalPath("/blog/post#faq")).toBe("/blog/post");
    expect(internalPath("/blog?page=2")).toBe("/blog");
    expect(internalPath("/blog/")).toBe("/blog");
    expect(internalPath("/")).toBe("/");
  });
});

describe("extractLinks", () => {
  it("reads anchor hrefs and ignores URLs embedded in scripts", () => {
    const html = `
      <a href="/about">About</a>
      <a class="x" href="https://caraway.au/contact">Contact</a>
      <a href="https://example.com">External</a>
      <script>self.__next={"href":"/should-not-count"}</script>`;

    expect(extractLinks(html)).toEqual(["/about", "/contact"]);
  });
});

describe("isNoindex", () => {
  it("detects a robots meta that withholds indexing", () => {
    expect(
      isNoindex('<meta name="robots" content="noindex, follow"/>'),
    ).toBe(true);
    expect(isNoindex('<meta name="robots" content="index, follow"/>')).toBe(
      false,
    );
    expect(isNoindex("<p>no meta here</p>")).toBe(false);
  });
});

describe("redirectStatusFromMeta", () => {
  it("recognises a prerendered redirect by its status", () => {
    expect(redirectStatusFromMeta('{"status":308}')).toBe(308);
    expect(redirectStatusFromMeta('{"status":301}')).toBe(301);
  });

  it("treats a normal page, missing sidecar or malformed JSON as not a redirect", () => {
    expect(redirectStatusFromMeta('{"headers":{}}')).toBeNull();
    expect(redirectStatusFromMeta('{"status":200}')).toBeNull();
    expect(redirectStatusFromMeta(null)).toBeNull();
    expect(redirectStatusFromMeta("not json")).toBeNull();
  });
});

describe("analyze", () => {
  it("flags an indexable page that nothing links to", () => {
    const pages = new Map<string, Page>([
      ["/", page(["/about"])],
      ["/about", page(["/"])],
      ["/stranded", page(["/"])],
    ]);

    expect(analyze(pages).orphans).toEqual(["/stranded"]);
  });

  it("never treats the home page as an orphan", () => {
    const pages = new Map<string, Page>([
      ["/", page(["/about"])],
      ["/about", page([])],
    ]);

    expect(analyze(pages).orphans).toEqual([]);
  });

  it("exempts noindex pages, which are unlisted on purpose", () => {
    const pages = new Map<string, Page>([
      ["/", page([])],
      ["/review", page([], true)],
    ]);

    expect(analyze(pages).orphans).toEqual([]);
  });

  it("does not let a self-link disguise an orphan", () => {
    const pages = new Map<string, Page>([
      ["/", page([])],
      ["/lonely", page(["/lonely"])],
    ]);

    expect(analyze(pages).orphans).toEqual(["/lonely"]);
  });

  it("reports a page reachable only from deep pagination", () => {
    const pages = new Map<string, Page>([
      ["/", page(["/blog"])],
      ["/blog", page(["/blog/page/3"])],
      ["/blog/page/3", page(["/blog/buried", "/blog/linked"])],
      ["/blog/buried", page([])],
      ["/blog/linked", page([])],
      ["/hub", page(["/blog/linked"])],
    ]);

    const { orphans, paginationOnly } = analyze(pages);
    expect(orphans).toEqual(["/hub"]);
    // /blog/linked also has a hub link, so only /blog/buried is pagination-only.
    expect(paginationOnly).toEqual(["/blog/buried"]);
  });
});
