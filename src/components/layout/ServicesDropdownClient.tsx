import Link from "next/link";
import { ChevronDown } from "lucide-react";

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function ServicesDropdownClient({ serviceLinks }: Props) {
  return (
    <details className="group relative h-full">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-sm px-3 py-3 text-sm font-semibold text-primary/85 transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        Services
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-open:rotate-180"
        />
      </summary>

      <ul className="absolute left-0 top-full z-50 grid w-[480px] max-w-[calc(100vw-2rem)] list-none grid-cols-2 rounded-sm border border-border bg-card py-1.5 shadow-lg">
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
      </ul>
    </details>
  );
}
