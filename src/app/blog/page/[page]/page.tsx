import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Blog from "@/views/Blog";
import { blogPagePosts, blogTotalPages } from "@/lib/blog-pagination";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ page: string }> };

/** Page 1 lives at /blog (a permanent redirect in next.config.ts covers
 *  /blog/page/1), so only pages 2..N are generated here. */
export function generateStaticParams() {
  const total = blogTotalPages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const canonical = `${SITE_URL}/blog/page/${page}`;
  const title = `Cash for Cars Brisbane Blog — Page ${page}`;
  const description =
    "More tips and guides on selling your car for cash in Brisbane — pricing, paperwork, and how same- or next-day pickup works.";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [
        {
          url: "/images/og-card.jpg",
          width: 1200,
          height: 630,
          alt: "Caraway cash for cars Brisbane",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { page } = await params;
  const pageNumber = Number(page);
  const totalPages = blogTotalPages();
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const posts = blogPagePosts(pageNumber);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Blog", item: `${SITE_URL}/blog` },
            { name: `Page ${pageNumber}`, item: `${SITE_URL}/blog/page/${pageNumber}` },
          ]),
        ]}
      />
      <Blog posts={posts} page={pageNumber} totalPages={totalPages} />
    </>
  );
}
