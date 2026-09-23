import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DisclosureAutoClose } from "./DisclosureAutoClose";

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function ServicesDropdownClient({ serviceLinks }: Props) {
  return (
    <DisclosureAutoClose className="group relative h-full">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-sm px-3 py-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-150 group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-full z-50 w-64 max-w-[calc(100vw-2rem)] list-none rounded border border-border bg-background py-2">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-4 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-2 border-t border-border pt-2">
          <Link
            href="/services"
            className="block px-4 py-2.5 text-sm text-primary underline decoration-primary/35 underline-offset-4 transition-colors duration-150 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View all services
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
