import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { DisclosureAutoClose } from "./DisclosureAutoClose";

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function ServicesDropdownClient({ serviceLinks }: Props) {
  return (
    <DisclosureAutoClose className="group relative h-full">
      <summary className="flex h-11 cursor-pointer list-none items-center gap-1 border-b-2 border-transparent px-2.5 text-[0.9375rem] font-medium text-on-dark transition-colors duration-200 hover:border-cta/60 hover:text-on-dark-hi group-open:border-cta group-open:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 max-w-[calc(100vw-2rem)] list-none border border-border border-t-4 border-t-cta bg-card py-1.5 shadow-xl">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block border-l-4 border-transparent px-5 py-3 text-[0.9375rem] font-medium text-foreground transition-all duration-150 hover:border-cta hover:bg-secondary hover:text-foreground focus-visible:bg-secondary/70 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t border-border pt-1">
          <Link
            href="/services"
            className="flex items-center gap-1.5 border-l-4 border-transparent px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-primary transition-all duration-150 hover:border-cta hover:bg-secondary focus-visible:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
