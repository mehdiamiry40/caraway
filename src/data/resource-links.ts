/**
 * Curated links for SEO (internal hubs) and E-E-A-T (authoritative .gov.au / official sources).
 * External entries open in a new tab — use rel="noopener noreferrer".
 */

export const FOOTER_INTERNAL_RESOURCES = [
  { label: "Cash for cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Free car removal", href: "/car-removal-brisbane" },
  { label: "Scrap & unwanted cars", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged & written-off cars", href: "/damaged-cars-brisbane" },
  { label: "Blog & selling guides", href: "/blog" },
  { label: "All FAQs", href: "/faq" },
] as const;

export const AUTHORITY_OUTBOUND_LINKS = [
  {
    label: "Transfer vehicle registration (Queensland Government)",
    href: "https://www.qld.gov.au/transport/registration/transfer",
  },
  {
    label: "Verify our ABN (ABR)",
    href: "https://abr.business.gov.au/ABN/View?abn=62351619456",
  },
  {
    label: "Safety certificates (Queensland Government)",
    href: "https://www.qld.gov.au/transport/registration/roadworthy",
  },
  {
    label: "Cancel vehicle registration (Queensland Government)",
    href: "https://www.qld.gov.au/transport/registration/cancel",
  },
] as const;
