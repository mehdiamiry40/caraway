import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Blog, { blogPageCount } from "@/views/Blog";
import { SITE_URL } from "@/lib/site";

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
  const title = `Cash for Cars Brisbane Blog — Page ${page}`;
  const description =
    "More tips and guides on selling your car for cash in Brisbane: pricing, paperwork, and how same- or next-day pickup works.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) notFound();
  // Page 1 lives at /blog — never serve the same content on two URLs.
  if (page === 1) redirect("/blog");
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
