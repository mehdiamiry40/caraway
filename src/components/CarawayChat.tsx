"use client";

import { useChat } from "@ai-sdk/react";
import {
  ArrowUp,
  Bot,
  ExternalLink,
  Loader2,
  Phone,
  RotateCcw,
  Square,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { trackEvent } from "@/lib/analytics";
import type { CarawayChatMessage } from "@/lib/chat-assistant";
import { BUSINESS } from "@/lib/site";
import { CarawayChatLauncher } from "@/components/CarawayChatLauncher";

const QUICK_ACTIONS = [
  { label: "How do I get a quote?", message: "How do I get a quote for my car?" },
  { label: "Is towing free?", message: "Is towing free, and what areas do you cover?" },
  { label: "What cars do you buy?", message: "What types of vehicles do you buy?" },
] as const;

const MAX_INPUT_LENGTH = 1_000;
const INLINE_MARKDOWN_RE =
  /(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)|(`([^`\n]+)`)|(\[([^\]\n]+)\]\(([^)\s]+)\))/g;

function isSafeChatHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href) || /^\/(?!\/)/.test(href);
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const content: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of text.matchAll(INLINE_MARKDOWN_RE)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) content.push(text.slice(lastIndex, matchIndex));

    const key = `${keyPrefix}-${tokenIndex++}`;
    if (match[1]) {
      content.push(
        <strong key={key} className="font-semibold text-foreground">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      content.push(<em key={key}>{match[4]}</em>);
    } else if (match[5]) {
      content.push(
        <code key={key} className="rounded bg-muted px-1 py-0.5 text-xs">
          {match[6]}
        </code>,
      );
    } else if (match[7]) {
      const href = match[9];
      content.push(
        isSafeChatHref(href) ? (
          <a
            key={key}
            href={href}
            target={/^https?:\/\//i.test(href) ? "_blank" : undefined}
            rel={/^https?:\/\//i.test(href) ? "noopener noreferrer" : undefined}
            className="font-medium text-primary underline underline-offset-2"
          >
            {match[8]}
          </a>
        ) : (
          match[8]
        ),
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) content.push(text.slice(lastIndex));
  return content;
}

function AssistantMarkdown({ children }: { children: string }) {
  const blocks = children.trim().split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim().length > 0);
        const unorderedItems = lines.map((line) => line.match(/^\s*[-*]\s+(.+)$/));
        const orderedItems = lines.map((line) => line.match(/^\s*\d+[.)]\s+(.+)$/));

        if (lines.length > 0 && unorderedItems.every(Boolean)) {
          return (
            <ul
              key={`block-${blockIndex}`}
              className="mt-2 list-disc space-y-1 pl-4 first:mt-0"
            >
              {unorderedItems.map((item, itemIndex) => (
                <li key={`block-${blockIndex}-item-${itemIndex}`}>
                  {renderInlineMarkdown(
                    item?.[1] ?? "",
                    `block-${blockIndex}-item-${itemIndex}`,
                  )}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length > 0 && orderedItems.every(Boolean)) {
          return (
            <ol
              key={`block-${blockIndex}`}
              className="mt-2 list-decimal space-y-1 pl-4 first:mt-0"
            >
              {orderedItems.map((item, itemIndex) => (
                <li key={`block-${blockIndex}-item-${itemIndex}`}>
                  {renderInlineMarkdown(
                    item?.[1] ?? "",
                    `block-${blockIndex}-item-${itemIndex}`,
                  )}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`block-${blockIndex}`} className="[&:not(:first-child)]:mt-2">
            {lines.map((line, lineIndex) => (
              <span key={`block-${blockIndex}-line-${lineIndex}`}>
                {renderInlineMarkdown(
                  line.replace(/^#{1,6}\s+/, ""),
                  `block-${blockIndex}-line-${lineIndex}`,
                )}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function CarawayChat({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const {
    messages,
    sendMessage,
    status,
    error,
    clearError,
    setMessages,
    stop,
    regenerate,
  } = useChat<CarawayChatMessage>();

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) launcherRef.current?.focus();
      return;
    }
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      trackEvent("chat_opened");
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'body > a[href="#main-content"], #main-content, body header, body footer, [data-testid="sticky-mobile-cta"]',
      ),
    );
    const previousInertValues = backgroundElements.map(
      (element) => [element, element.inert] as const,
    );
    backgroundElements.forEach((element) => {
      element.inert = true;
    });
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      previousInertValues.forEach(([element, wasInert]) => {
        element.inert = wasInert;
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  }, [input]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [isOpen, messages, status]);

  function openChat() {
    setIsOpen(true);
  }

  function closeChat() {
    setIsOpen(false);
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || isBusy) return;
    clearError();
    setInput("");
    trackEvent("chat_message_sent");
    await sendMessage({ text: message });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  function resetChat() {
    if (isBusy) stop();
    setMessages([]);
    clearError();
    setInput("");
    inputRef.current?.focus();
  }

  async function retryLastResponse() {
    clearError();
    await regenerate();
  }

  return (
    <>
      {isOpen && (
        <section
          ref={panelRef}
          id="caraway-chat-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="caraway-chat-title"
          aria-describedby="caraway-chat-description"
          className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[200] flex max-h-[min(42rem,calc(100dvh-7rem))] flex-col overflow-hidden rounded-md border border-border bg-card shadow-[0_20px_60px_hsl(var(--shadow-color)/0.28)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[25rem]"
        >
          <header className="flex items-center gap-3 border-b border-primary/25 bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/12">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="caraway-chat-title"
                className="truncate text-base font-semibold text-primary-foreground"
              >
                Ask Caraway
              </h2>
              <p
                id="caraway-chat-description"
                className="text-xs text-primary-foreground/80"
              >
                AI quotes and quick answers
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetChat}
                className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/85 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                aria-label="Start a new chat"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={closeChat}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/85 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-muted/50 px-4 py-4 overscroll-contain"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-busy={isBusy}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="max-w-[85%] rounded-sm rounded-tl-none border border-border bg-card px-3.5 py-3 text-sm leading-relaxed text-foreground shadow-sm">
                Hi — I’m Caraway’s AI assistant. I can estimate your car’s value
                or answer questions about selling and pickup across Greater
                Brisbane.
              </div>
            </div>

            {messages.length === 0 && (
              <div className="ml-9 flex flex-wrap gap-2" aria-label="Suggested questions">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => void send(action.message)}
                    className="rounded-full border border-primary/35 bg-card px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const hasVisibleContent = message.parts.some(
                (part) => part.type === "text" && part.text.length > 0,
              );
              if (!hasVisibleContent) return null;

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${isUser ? "justify-end" : ""}`}
                >
                  {!isUser && (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <div className={`max-w-[88%] ${isUser ? "" : "space-y-2.5"}`}>
                    {message.parts.map((part, index) => {
                      if (part.type === "text" && part.text.length > 0) {
                        return (
                          <div
                            key={`${message.id}-text-${index}`}
                            className={`rounded-sm px-3.5 py-3 text-sm leading-relaxed shadow-sm ${
                              isUser
                                ? "whitespace-pre-wrap rounded-tr-none bg-primary text-primary-foreground"
                                : "rounded-tl-none border border-border bg-card text-foreground"
                            }`}
                          >
                            {isUser ? (
                              part.text
                            ) : (
                              <AssistantMarkdown>{part.text}</AssistantMarkdown>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              );
            })}

            {isBusy && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground" role="status">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3.5 py-2.5 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {status === "submitted" ? "Thinking…" : "Replying…"}
                </span>
              </div>
            )}

            {error && (
              <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-foreground" role="alert">
                <p>
                  Chat is temporarily unavailable. Try that message again or call{" "}
                  <a className="font-semibold text-primary underline" href={BUSINESS.phoneTel}>
                    {BUSINESS.phoneDisplay}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => void retryLastResponse()}
                  className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-primary/30 bg-card px-3 text-xs font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="border-t border-border bg-card p-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <label htmlFor="caraway-chat-input" className="sr-only">
                Ask Caraway a question
              </label>
              <textarea
                ref={inputRef}
                id="caraway-chat-input"
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                onKeyDown={handleInputKeyDown}
                maxLength={MAX_INPUT_LENGTH}
                rows={1}
                placeholder="Ask a question or describe your car…"
                disabled={isBusy}
                className="max-h-28 min-h-11 flex-1 resize-none overflow-y-auto rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type={isBusy ? "button" : "submit"}
                onClick={isBusy ? stop : undefined}
                disabled={!isBusy && input.trim().length === 0}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-cta-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isBusy ? "bg-primary hover:bg-primary/90" : "bg-cta hover:bg-cta/90"
                }`}
                aria-label={isBusy ? "Stop response" : "Send message"}
              >
                {isBusy ? (
                  <Square className="h-4 w-4 fill-current" aria-hidden="true" />
                ) : (
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-[0.6875rem] text-muted-foreground">
              <span className="hidden sm:inline">Enter to send · Shift+Enter for a new line</span>
              <span className="sm:hidden">Quotes come from the form</span>
              <span className="flex items-center gap-3">
                <Link
                  href="/#quote-form"
                  prefetch={false}
                  className="font-medium text-primary hover:underline"
                >
                  Full quote <ExternalLink className="inline h-3 w-3" aria-hidden="true" />
                </Link>
                <a href={BUSINESS.phoneTel} className="font-medium text-primary hover:underline">
                  <Phone className="mr-0.5 inline h-3 w-3" aria-hidden="true" />
                  Call
                </a>
              </span>
            </div>
          </footer>
        </section>
      )}

      {!isOpen && (
        <CarawayChatLauncher buttonRef={launcherRef} onClick={openChat} />
      )}
    </>
  );
}
