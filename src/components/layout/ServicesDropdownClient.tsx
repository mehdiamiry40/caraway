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
      <summary className="relative flex h-full cursor-pointer list-none items-center gap-1.5 border-x border-[hsl(var(--on-dark-hi)/0.16)] px-5 text-sm font-semibold text-on-dark-hi/80 transition-colors duration-200 after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-cta after:transition-transform hover:bg-[hsl(var(--on-dark-hi)/0.06)] hover:text-on-dark-hi hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset group-open:bg-[hsl(var(--on-dark-hi)/0.08)] group-open:text-on-dark-hi group-open:after:scale-x-100 [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-full z-50 w-72 max-w-[calc(100vw-2rem)] list-none border border-border bg-card py-2 shadow-lg">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block border-l-2 border-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-primary hover:bg-muted hover:text-primary focus-visible:border-primary focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t border-border pt-1">
          <Link
            href="/services"
            className="flex items-center gap-1.5 border-l-2 border-transparent px-5 py-3 text-sm font-semibold text-primary transition-all duration-150 hover:border-primary hover:bg-muted focus-visible:border-primary focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
