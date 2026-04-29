"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type ServiceLink = { label: string; href: string };

interface Props {
  serviceLinks: ServiceLink[];
}

export function MobileMenuClient({ serviceLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollToQuote = useScrollToQuote();

  const close = () => setIsOpen(false);
  const open = () => {
    setIsMobileServicesOpen(false);
    setIsOpen(true);
  };

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menu = mobileMenuRef.current;
    if (!menu) return () => { document.body.style.overflow = prev; };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRef.current?.focus();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    menu.addEventListener("keydown", handleTab);
    menu.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )[0]?.focus();

    return () => {
      document.body.style.overflow = prev;
      menu.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  const handleScrollToQuote = () => {
    close();
    scrollToQuote();
  };

  const drawer = isOpen ? (
    <div
      ref={mobileMenuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="fixed inset-0 z-[100] lg:hidden flex flex-col pt-safe pb-safe"
    >
      <div
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 bg-foreground/20"
        onClick={close}
      />
      <div className="relative bg-background flex flex-col h-full w-full pl-safe pr-safe">
        <div className="flex items-center justify-between min-h-14 px-4 sm:px-6 border-b border-border shrink-0">
          <span className="font-medium text-lg lowercase text-foreground">
            caraway
          </span>
          <button
            type="button"
            onClick={close}
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 flex flex-col p-4 sm:p-6 gap-1 overflow-y-auto overscroll-contain min-h-0">
          <nav className="flex flex-col" aria-label="Mobile primary navigation">
            <button
              type="button"
              onClick={() => setIsMobileServicesOpen((v) => !v)}
              aria-expanded={isMobileServicesOpen}
              aria-controls="mobile-services-list"
              className={cn(
                "text-base py-3 min-h-12 border-b border-border flex items-center justify-between transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
                "text-foreground"
              )}
            >
              <span>Services</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isMobileServicesOpen ? "rotate-180" : ""
                )}
              />
            </button>
            {isMobileServicesOpen && (
              <ul id="mobile-services-list" className="flex flex-col list-none border-b border-border pb-2">
                {serviceLinks.map((service) => {
                  const isActive = pathname === service.href;
                  return (
                    <li key={service.href}>
                      <Link
                        href={service.href}
                        onClick={close}
                        className={cn(
                          "text-sm py-2.5 min-h-11 flex items-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {service.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className={cn(
                    "text-base py-3 min-h-12 border-b border-border flex items-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-6 pb-safe">
            <Button
              onClick={handleScrollToQuote}
              size="lg"
              className="w-full"
            >
              Get a quote
            </Button>
            <a
              href={BUSINESS.phoneTel}
              onClick={() => {
                trackEvent("phone_click", { location: "header_drawer" });
                close();
              }}
              className="inline-flex items-center justify-center w-full h-12 rounded-md border border-border text-foreground text-sm hover:bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="lg:hidden flex items-center">
        <button
          type="button"
          ref={triggerRef}
          className="min-h-11 min-w-11 -mr-1 inline-flex items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={open}
          aria-label="Open menu"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {drawer && createPortal(drawer, document.body)}
    </>
  );
}
