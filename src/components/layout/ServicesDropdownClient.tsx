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
      <summary className="flex h-11 cursor-pointer list-none items-center gap-1 rounded-sm px-2.5 text-[0.9375rem] font-medium text-foreground/80 decoration-foreground/30 decoration-2 underline-offset-[10px] transition-colors duration-150 hover:text-primary hover:underline group-open:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-64 max-w-[calc(100vw-2rem)] list-none rounded-lg border border-border bg-card py-2 shadow-xl">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-4 py-2.5 text-[0.9375rem] font-medium text-foreground transition-colors duration-150 hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-2 border-t border-border pt-2">
          <Link
            href="/services"
            className="flex items-center gap-1.5 px-4 py-2.5 text-[0.9375rem] font-semibold text-accent-ink transition-colors duration-150 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
