import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Blog from "@/views/Blog";
import { blogPageCount } from "@/lib/blog-pagination";
import { OPEN_GRAPH_DEFAULTS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

interface Props {
  params: Promise<{ page: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, blogPageCount() - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  return Number.isSafeInteger(page) && page >= 1 ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page || page < 2 || page > blogPageCount()) return {};

  const canonical = `${SITE_URL}/blog/page/${page}`;
  const title = `Brisbane Car Selling Guides — Page ${page}`;
  const description = `Page ${page} of Caraway's practical Brisbane guides to vehicle valuation, selling options, collection planning, and Queensland paperwork.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      type: "website",
      url: canonical,
      title,
      description,
    },
    // "summary", not "summary_large_image": there is no image to feature.
    twitter: { card: "summary", title, description },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) notFound();
  // Page 1 lives at /blog — never serve the same content on two URLs.
  if (page === 1) permanentRedirect("/blog");
  if (page > blogPageCount()) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Blog", item: `${SITE_URL}/blog` },
            { name: `Page ${page}`, item: `${SITE_URL}/blog/page/${page}` },
          ]),
        ]}
      />
      <Blog page={page} />
    </>
  );
}
