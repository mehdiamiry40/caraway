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
      <summary className="flex h-12 cursor-pointer list-none items-center gap-1.5 border-b-[3px] border-transparent px-3.5 text-[1.0625rem] font-semibold text-on-dark-hi transition-colors duration-150 hover:bg-accent-hover group-open:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [--ring:48_100%_65%] xl:px-5 [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 ease-out group-open:rotate-180"
          strokeWidth={2.5}
        />
      </summary>

      <ul className="absolute left-0 top-full z-50 w-64 max-w-[calc(100vw-2rem)] list-none rounded-b-md border border-t-0 border-border bg-card py-1.5 shadow-xl">
        {serviceLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-4 py-2.5 text-base font-semibold text-foreground transition-colors duration-150 hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-1.5 border-t border-border pt-1.5">
          <Link
            href="/services"
            className="flex items-center gap-1.5 px-4 py-2.5 text-base font-bold text-primary transition-colors duration-150 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </DisclosureAutoClose>
  );
}
