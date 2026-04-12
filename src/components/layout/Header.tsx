"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { services } from "@/data/services";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "";

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLUListElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesMenuId = useId();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Restore focus to the menu trigger whenever the drawer closes. Using a
  // dedicated effect (rather than rAF inside the close handler) ensures the
  // focus transfer happens after React has committed the unmount, which is
  // more reliable with screen readers than rAF.
  const wasMobileMenuOpen = useRef(false);
  useEffect(() => {
    if (wasMobileMenuOpen.current && !isMobileMenuOpen) {
      mobileMenuTriggerRef.current?.focus();
    }
    wasMobileMenuOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const openMobileMenu = () => {
    // Default Services section to expanded each time the drawer opens so
    // users see all six service links immediately.
    setIsMobileServicesOpen(true);
    setIsMobileMenuOpen(true);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menu = mobileMenuRef.current;
    if (!menu) return () => { document.body.style.overflow = prev; };
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMobileMenu(); return; }
      if (e.key !== "Tab") return;
      // Recompute focusable elements on every Tab so we don't rely on a stale
      // snapshot captured at mount — collapsible sections (e.g. mobile Services)
      // may add/remove focusable nodes while the drawer is open.
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
    // Focus the first focusable element on open.
    const initialFocusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    initialFocusable[0]?.focus();

    return () => {
      document.body.style.overflow = prev;
      menu.removeEventListener("keydown", handleTab);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isServicesOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        servicesTriggerRef.current?.contains(target) ||
        servicesMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsServicesOpen(false);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      if (
        servicesTriggerRef.current?.contains(target) ||
        servicesMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsServicesOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isServicesOpen]);

  const scrollToQuote = () => {
    if (isHome) {
      document.getElementById("price-estimator")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#price-estimator");
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Locations", href: "/locations" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const serviceDropdown = services.map((s) => ({
    label: s.title.split("|")[0].trim(),
    href: `/${s.slug}`,
  }));

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe bg-primary shadow-sm"
      )}>
        {/* Top bar */}
        <div className="border-b border-white/20 pl-safe pr-safe">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-14 h-14">
            <Link href="/" aria-label="Caraway — Home" className="flex items-center gap-2 group">
              <span className="font-display font-bold text-2xl tracking-tight text-white lowercase transition-opacity duration-200 group-hover:opacity-80">
                caraway<span className="text-accent">.</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={BUSINESS.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "header" })}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label={`Call ${BUSINESS.phoneFriendly}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>{BUSINESS.phoneFriendly}</span>
              </a>
              <Button
                onClick={scrollToQuote}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ring-offset-primary"
              >
                Get my quote
              </Button>
            </div>

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
                onClick={scrollToQuote}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white text-xs font-semibold px-3 h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ring-offset-primary"
              >
                Quote
              </Button>
              <button
                type="button"
                ref={mobileMenuTriggerRef}
                className="min-h-11 min-w-11 -mr-1 inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                onClick={openMobileMenu}
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="border-b border-black/10 hidden lg:block pl-safe pr-safe bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Primary navigation" className="flex items-center gap-1 h-12">
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  ref={servicesTriggerRef}
                  type="button"
                  className={cn(
                    "text-sm font-medium transition-all duration-200 flex items-center gap-1 rounded-full px-4 py-1.5 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                    pathname === "/cash-for-cars-brisbane" || pathname.startsWith("/cash-for-cars-brisbane/")
                      ? "text-white border-white/30 bg-white/15"
                      : "text-white hover:border-white/30 hover:bg-white/15"
                  )}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-controls={servicesMenuId}
                  onFocus={() => setIsServicesOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsServicesOpen(true);
                      requestAnimationFrame(() => {
                        servicesMenuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
                      });
                    } else if (e.key === "Escape") {
                      setIsServicesOpen(false);
                    }
                  }}
                >
                  Services
                  <ChevronDown aria-hidden="true" className={cn("h-3.5 w-3.5 transition-transform duration-300 ease-out", isServicesOpen ? "rotate-180" : "")} />
                </button>

                {isServicesOpen && (
                  <ul
                    id={servicesMenuId}
                    ref={servicesMenuRef}
                    aria-label="Services submenu"
                    className="absolute top-full left-0 mt-0 w-[480px] bg-white rounded-lg shadow-lg border border-border/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 list-none grid grid-cols-2"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsServicesOpen(false);
                        servicesTriggerRef.current?.focus();
                      }
                    }}
                  >
                    {serviceDropdown.map((item) => {
                      const isDropdownItemActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsServicesOpen(false)}
                            className={cn(
                              "block px-5 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              isDropdownItemActive
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

              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                <div key={link.label} className="relative h-full flex items-center">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 flex items-center rounded-full px-4 py-1.5 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                      isActive
                        ? "text-white border-white/30 bg-white/15"
                        : "text-white hover:border-white/30 hover:bg-white/15"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              );})}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} role="dialog" aria-modal="true" aria-label="Main menu" className="fixed inset-0 z-[100] lg:hidden flex flex-col pt-safe pb-safe animate-in fade-in duration-200">
          {/* Backdrop: not keyboard-interactive — the in-drawer close button is
              the accessible close affordance. Mark it hidden from a11y tree. */}
          <div
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 bg-black/20 animate-in fade-in duration-300"
            onClick={closeMobileMenu}
          />
          <div className="relative bg-white flex flex-col h-full w-full animate-in slide-in-from-right-full duration-300 ease-out pl-safe pr-safe">
            <div className="flex items-center justify-between min-h-14 px-4 border-b border-border/40 shrink-0">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-primary lowercase">
                caraway<span className="text-accent">.</span>
              </span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-primary hover:bg-muted transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Close menu"
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto overscroll-contain min-h-0">
              <nav className="flex flex-col gap-0.5" aria-label="Mobile primary navigation">
                {/* Mobile Services collapsible — all service links must be
                    reachable without the desktop hover/focus pattern. */}
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
                          onClick={closeMobileMenu}
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
                      {serviceDropdown
                        .filter((s) => s.href !== "/cash-for-cars-brisbane")
                        .map((service) => {
                          const isActive = pathname === service.href;
                          return (
                            <li key={service.href}>
                              <Link
                                href={service.href}
                                onClick={closeMobileMenu}
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
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                  <div key={link.label} className="flex flex-col" style={{ animationDelay: `${index * 40}ms` }}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "text-base sm:text-lg font-display font-semibold py-3 min-h-12 border-b border-border/30 flex items-center justify-between transition-colors duration-200 rounded-lg px-2 -mx-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive
                          ? "text-primary bg-primary/5"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <span className="w-1 h-5 rounded-full bg-primary" />}
                        {link.label}
                      </span>
                    </Link>
                  </div>
                );})}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-4 pb-safe border-t border-border/30">
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => {
                    trackEvent("phone_click", { location: "header_drawer" });
                    closeMobileMenu();
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full h-14 rounded-md border-2 border-primary text-primary font-bold text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Call ${BUSINESS.phoneFriendly}`}
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call {BUSINESS.phoneFriendly}
                </a>
                <Button
                  onClick={scrollToQuote}
                  size="lg"
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Get my quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
