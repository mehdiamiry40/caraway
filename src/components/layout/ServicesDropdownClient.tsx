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
          "text-sm font-medium transition-colors duration-200 flex items-center gap-1 rounded-md px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isServicesActive
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
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
          className="absolute top-full left-0 mt-1 w-[480px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-[0_24px_48px_-32px_hsl(var(--shadow-color)/0.4)] border border-border/70 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 list-none grid grid-cols-2"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              triggerRef.current?.focus();
              return;
            }
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              const items = Array.from(
                menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []
              );
              if (items.length === 0) return;
              const currentIndex = items.findIndex(
                (el) => el === document.activeElement
              );
              const delta = e.key === "ArrowDown" ? 1 : -1;
              const nextIndex =
                currentIndex === -1
                  ? e.key === "ArrowDown"
                    ? 0
                    : items.length - 1
                  : (currentIndex + delta + items.length) % items.length;
              items[nextIndex]?.focus();
            } else if (e.key === "Home") {
              e.preventDefault();
              const items = menuRef.current?.querySelectorAll<HTMLElement>("a[href]");
              items?.[0]?.focus();
            } else if (e.key === "End") {
              e.preventDefault();
              const items = menuRef.current?.querySelectorAll<HTMLElement>("a[href]");
              if (items && items.length > 0) items[items.length - 1]?.focus();
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
                    "block px-5 py-3 text-sm font-medium transition-all duration-150 focus-visible:bg-secondary/70 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "text-primary bg-accent/[0.08] border-l-2 border-accent"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/70 border-l-2 border-transparent"
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
