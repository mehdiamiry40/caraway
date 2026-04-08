"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/site";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Trap focus inside mobile menu
    const menu = mobileMenuRef.current;
    if (!menu) return () => { document.body.style.overflow = prev; };
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsMobileMenuOpen(false); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    menu.addEventListener("keydown", handleTab);
    first?.focus();

    return () => {
      document.body.style.overflow = prev;
      menu.removeEventListener("keydown", handleTab);
    };
  }, [isMobileMenuOpen]);

  const scrollToQuote = () => {
    if (isHome) {
      document.getElementById("quote-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#quote-section");
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Services", href: "/cash-for-cars-brisbane", hasDropdown: true },
    { label: "Locations", href: "/locations" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const serviceDropdown = [
    { label: "Cash for Cars Brisbane", href: "/cash-for-cars-brisbane" },
    { label: "Car Removal Brisbane", href: "/car-removal-brisbane" },
    { label: "Sell My Car Brisbane", href: "/sell-my-car-brisbane" },
    { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
    { label: "Unwanted Cars", href: "/unwanted-cars-brisbane" },
    { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 pt-safe",
        isScrolled ? "shadow-md" : ""
      )}>
        {/* Top bar — brand strip (I-MED–style deep teal) */}
        <div className="bg-primary border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-14 h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-bold text-2xl tracking-tight text-white lowercase">
                caraway<span className="text-accent">.</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-5">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {BUSINESS.phoneFriendly}
              </a>
              <Button
                onClick={scrollToQuote}
                size="sm"
                className="rounded-xl px-6 bg-accent hover:bg-accent/90 text-white border-0 font-semibold"
              >
                Get a Quote
              </Button>
            </div>

            <button
              type="button"
              className="lg:hidden min-h-11 min-w-11 -mr-1 inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10 hover:text-accent transition-colors touch-manipulation"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation bar — light clinical surface */}
        <div className="bg-background/95 backdrop-blur-sm border-b border-border hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Primary navigation" className="flex items-center gap-8 h-12">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => link.hasDropdown && setIsServicesOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setIsServicesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 group relative"
                    {...(link.hasDropdown ? {
                      "aria-expanded": isServicesOpen,
                      "aria-haspopup": "true" as const,
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Escape" && isServicesOpen) {
                          setIsServicesOpen(false);
                        } else if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setIsServicesOpen((prev) => !prev);
                        }
                      },
                    } : {})}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown aria-hidden="true" className={cn("h-3.5 w-3.5 transition-transform duration-200", isServicesOpen ? "rotate-180" : "")} />
                    )}
                  </Link>

                  {link.hasDropdown && isServicesOpen && (
                    <div
                      aria-label="Services submenu"
                      className="absolute top-full left-0 mt-0 w-64 bg-white rounded-b-lg shadow-lg border border-border/60 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setIsServicesOpen(false);
                      }}
                    >
                      {serviceDropdown.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted/60 transition-colors focus-visible:bg-muted/60 focus-visible:text-primary focus-visible:outline-none"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} role="dialog" aria-modal="true" aria-label="Main menu" className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col pt-safe pb-safe">
          <div className="flex items-center justify-between min-h-14 px-4 border-b border-border bg-primary shrink-0">
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white lowercase">
              caraway<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10 hover:text-accent transition-colors touch-manipulation"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto overscroll-contain min-h-0">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col">
                  <Link
                    href={link.href}
                    onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                    className="text-base sm:text-lg font-display font-semibold text-foreground hover:text-primary py-3 min-h-12 border-b border-border/40 flex items-center justify-between touch-manipulation"
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </Link>
                  {link.hasDropdown && (
                    <div className="flex flex-col gap-1 mt-2 pl-4 border-l-2 border-primary/20 mb-2">
                      {serviceDropdown.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2.5 min-h-11 flex items-center text-sm text-muted-foreground hover:text-primary touch-manipulation"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 pt-4 pb-safe border-t border-border/40">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center justify-center gap-2 min-h-14 rounded-xl bg-muted text-foreground font-semibold text-base sm:text-lg hover:bg-muted/80 transition-colors touch-manipulation"
              >
                <Phone className="h-5 w-5 text-accent" />
                {BUSINESS.phone}
              </a>
              <Button
                onClick={scrollToQuote}
                size="lg"
                className="w-full h-14 rounded-xl bg-accent hover:bg-accent/90 text-white border-0 font-bold text-base sm:text-lg"
              >
                Get My Free Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
