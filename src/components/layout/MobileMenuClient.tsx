"use client";

import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const MOBILE_MENU_CHANGE_EVENT = "caraway:mobile-menu-change";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "summary",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function MobileMenuClient({ serviceLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousMenuState = document.body.dataset.mobileMenuOpen;
    document.body.style.overflow = "hidden";
    document.body.dataset.mobileMenuOpen = "true";
    window.dispatchEvent(new Event(MOBILE_MENU_CHANGE_EVENT));

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousMenuState === undefined) {
        delete document.body.dataset.mobileMenuOpen;
      } else {
        document.body.dataset.mobileMenuOpen = previousMenuState;
      }
      window.dispatchEvent(new Event(MOBILE_MENU_CHANGE_EVENT));
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktopBreakpoint = () => {
      const dialog = dialogRef.current;
      if (desktop.matches && dialog?.open) dialog.close();
    };
    desktop.addEventListener("change", closeAtDesktopBreakpoint);
    return () => {
      desktop.removeEventListener("change", closeAtDesktopBreakpoint);
    };
  }, []);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    setIsOpen(true);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      // Defensive fallback for older embedded browsers. Current supported
      // browsers use showModal(), which also makes the page behind it inert.
      dialog.setAttribute("open", "");
    }
    closeButtonRef.current?.focus();
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }

  function handleDialogClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(focusableSelector);
    if (!dialog || !focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first || !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last || !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleBackdropClick(event: ReactMouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeMenu();
  }

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <a
        href={BUSINESS.phoneTel}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Call ${BUSINESS.phoneDisplay}`}
      >
        <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      </a>

      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        className="-mr-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-dialog"
      >
        <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation-dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        onClose={handleDialogClose}
        onKeyDown={handleDialogKeyDown}
        onClick={handleBackdropClick}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[250] m-0 h-[calc(100dvh-var(--header-h))] max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 border-t border-border bg-background p-0 text-foreground backdrop:bg-foreground/20 lg:hidden"
      >
        <div className="min-h-full px-5 py-5 sm:px-6">
          <div className="mb-2 flex min-h-11 items-center justify-between">
            <p id="mobile-navigation-title" className="eyebrow">
              Menu
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Close menu"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-col gap-0.5" aria-label="Mobile primary navigation">
            <details className="group/services">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between border-b border-border py-3.5 text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                <span>Services</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-150 group-open/services:rotate-180"
                />
              </summary>
              <ul className="flex list-none flex-col border-b border-border py-2">
                {serviceLinks.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center py-2 text-base text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/services"
                    onClick={closeMenu}
                    className="flex min-h-11 items-center py-2 text-base text-primary underline decoration-primary/35 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    All services
                  </Link>
                </li>
              </ul>
            </details>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-[52px] items-center border-b border-border py-3.5 text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-2">
            <a
              href={BUSINESS.phoneTel}
              onClick={closeMenu}
              className="inline-flex h-12 w-full items-center justify-center text-base text-primary underline decoration-primary/35 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#quote-form"
              prefetch={false}
              onClick={closeMenu}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full",
              )}
            >
              Get my quote
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}
