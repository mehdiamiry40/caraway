"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { services } from "@/data/services";

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function ServicesDropdownClient({ serviceLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const isServicesActive = services.some(
    (s) => pathname === "/" + s.slug || pathname.startsWith("/" + s.slug + "/")
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isOpen]);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "text-sm font-medium transition-all duration-200 flex items-center gap-1 rounded-full px-4 py-1.5 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
          isServicesActive
            ? "text-white border-white/30 bg-white/15"
            : "text-white hover:border-white/30 hover:bg-white/15"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
            requestAnimationFrame(() => {
              menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
            });
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        Services
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300 ease-out",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label="Services submenu"
          className="absolute top-full left-0 mt-0 w-[480px] bg-white rounded-lg shadow-lg border border-border/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 list-none grid grid-cols-2"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          {serviceLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-5 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "text-primary bg-primary/5 border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-muted border-l-2 border-transparent"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
