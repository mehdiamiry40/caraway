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
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-sm px-3 py-3 text-sm font-semibold text-primary/85 transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-full z-50 w-64 max-w-[calc(100vw-2rem)] list-none rounded-sm border border-border bg-card py-1.5 shadow-lg">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block border-l-2 border-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-secondary/70 hover:text-primary focus-visible:bg-secondary/70 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t border-border pt-1">
          <Link
            href="/services"
            className="flex items-center gap-1.5 border-l-2 border-transparent px-5 py-3 text-sm font-semibold text-primary transition-all duration-150 hover:bg-secondary/70 focus-visible:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
