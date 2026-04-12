"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";

const navLinks = [
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
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(true);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollToQuote = useScrollToQuote();

  const close = () => setIsOpen(false);
  const open = () => {
    setIsMobileServicesOpen(true);
    setIsOpen(true);
  };

  // Restore focus to the trigger whenever the drawer closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // Body scroll lock + focus trap while drawer is open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menu = mobileMenuRef.current;
    if (!menu) return () => { document.body.style.overflow = prev; };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
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
      className="fixed inset-0 z-[100] lg:hidden flex flex-col pt-safe pb-safe animate-in fade-in duration-200"
    >
      <div
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 bg-black/20 animate-in fade-in duration-300"
        onClick={close}
      />
      <div className="relative bg-white flex flex-col h-full w-full animate-in slide-in-from-right-full duration-300 ease-out pl-safe pr-safe">
        <div className="flex items-center justify-between min-h-14 px-4 border-b border-border/40 shrink-0">
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-primary lowercase">
            caraway<span className="text-accent">.</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-primary hover:bg-muted transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto overscroll-contain min-h-0">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile primary navigation">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen((v) => !v)}
                aria-expanded={isMobileServicesOpen}
                aria-controls="mobile-services-list"
                className={cn(
                  "text-base sm:text-lg font-display font-semibold py-3 min-h-12 border-b border-border/30 flex items-center justify-between transition-colors duration-200 rounded-lg px-2 -mx-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-2">Services</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-out",
                    isMobileServicesOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              {isMobileServicesOpen && (
                <ul id="mobile-services-list" className="flex flex-col pl-3 list-none">
                  <li>
                    <Link
                      href="/cash-for-cars-brisbane"
                      onClick={close}
                      className={cn(
                        "text-sm sm:text-base font-medium py-2.5 min-h-11 flex items-center rounded-lg px-2 -mx-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        pathname === "/cash-for-cars-brisbane"
                          ? "text-primary bg-primary/5"
                          : "text-foreground/80 hover:text-primary hover:bg-muted"
                      )}
                    >
                      Services overview
                    </Link>
                  </li>
                  {serviceLinks
                    .filter((s) => s.href !== "/cash-for-cars-brisbane")
                    .map((service) => {
                      const isActive = pathname === service.href;
                      return (
                        <li key={service.href}>
                          <Link
                            href={service.href}
                            onClick={close}
                            className={cn(
                              "text-sm sm:text-base font-medium py-2.5 min-h-11 flex items-center rounded-lg px-2 -mx-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              isActive
                                ? "text-primary bg-primary/5"
                                : "text-foreground/80 hover:text-primary hover:bg-muted"
                            )}
                          >
                            {service.label}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            {navLinks.map((link, index) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <div
                  key={link.label}
                  className="flex flex-col"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "text-base sm:text-lg font-display font-semibold py-3 min-h-12 border-b border-border/30 flex items-center justify-between transition-colors duration-200 rounded-lg px-2 -mx-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && (
                        <span className="w-1 h-5 rounded-full bg-primary" />
                      )}
                      {link.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-4 pb-safe border-t border-border/30">
            <a
              href={BUSINESS.phoneHref}
              onClick={() => {
                trackEvent("phone_click", { location: "header_drawer" });
                close();
              }}
              className="inline-flex items-center justify-center gap-2 w-full h-14 rounded-md border-2 border-primary text-primary font-bold text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {BUSINESS.phoneFriendly}
            </a>
            <Button
              onClick={handleScrollToQuote}
              size="lg"
              className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get my quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Mobile top-bar controls (phone icon, Quote button, hamburger) */}
      <div className="lg:hidden flex items-center gap-2">
        <a
          href={BUSINESS.phoneHref}
          onClick={() => trackEvent("phone_click", { location: "header" })}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          aria-label={`Call ${BUSINESS.phoneFriendly}`}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
        <Button
          onClick={handleScrollToQuote}
          size="sm"
          className="bg-accent hover:bg-accent/90 text-white text-xs font-semibold px-3 h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ring-offset-primary"
        >
          Quote
        </Button>
        <button
          type="button"
          ref={triggerRef}
          className="min-h-11 min-w-11 -mr-1 inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          onClick={open}
          aria-label="Open menu"
        >
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      {/* Drawer rendered at document.body via portal to escape header's stacking context */}
      {drawer && createPortal(drawer, document.body)}
    </>
  );
}
