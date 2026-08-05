"use client";

import { useChat } from "@ai-sdk/react";
import {
  ArrowUp,
  Bot,
  ExternalLink,
  Loader2,
  MessageCircle,
  Phone,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { trackEvent } from "@/lib/analytics";
import type { CarawayChatMessage } from "@/lib/chat-assistant";
import { BUSINESS } from "@/lib/site";

const QUICK_ACTIONS = [
  { label: "Get a car estimate", message: "Can you estimate what my car is worth?" },
  { label: "Is towing free?", message: "Is towing free, and what areas do you cover?" },
  { label: "What cars do you buy?", message: "What types of vehicles do you buy?" },
] as const;

const MAX_INPUT_LENGTH = 1_000;

export function CarawayChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const { messages, sendMessage, status, error, clearError, setMessages, stop } =
    useChat<CarawayChatMessage>();

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [isOpen, messages, status]);

  function openChat() {
    setIsOpen(true);
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      trackEvent("chat_opened");
    }
  }

  function closeChat() {
    setIsOpen(false);
    launcherRef.current?.focus();
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

  return (
    <>
      {isOpen && (
        <section
          id="caraway-chat-panel"
          role="dialog"
          aria-labelledby="caraway-chat-title"
          aria-describedby="caraway-chat-description"
          className="fixed inset-x-3 bottom-[calc(9.75rem+env(safe-area-inset-bottom,0px))] z-[200] flex max-h-[min(38rem,calc(100dvh-11rem))] flex-col overflow-hidden rounded-md border border-border bg-card shadow-[0_20px_60px_hsl(var(--shadow-color)/0.28)] sm:inset-x-auto sm:right-6 sm:w-[25rem] lg:bottom-24"
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
                Quotes and quick answers
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
            aria-live="polite"
            aria-busy={isBusy}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="max-w-[85%] rounded-sm rounded-tl-none border border-border bg-card px-3.5 py-3 text-sm leading-relaxed text-foreground shadow-sm">
                Hi — I’m Caraway’s virtual assistant. I can estimate your car’s
                value or answer questions about selling and pickup in Greater
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
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
              if (!text) return null;

              const isUser = message.role === "user";
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
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-3.5 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-tr-none bg-primary text-primary-foreground"
                        : "rounded-tl-none border border-border bg-card text-foreground"
                    }`}
                  >
                    {text}
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
              <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-foreground" role="alert">
                Chat is temporarily unavailable. Please try again or call{" "}
                <a className="font-semibold text-primary underline" href={BUSINESS.phoneTel}>
                  {BUSINESS.phoneDisplay}
                </a>
                .
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
                className="max-h-28 min-h-11 flex-1 resize-none rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isBusy || input.trim().length === 0}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-cta text-cta-foreground shadow-sm transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                {isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-[0.6875rem] text-muted-foreground">
              <span>Indicative estimates only</span>
              <span className="flex items-center gap-3">
                <Link href="/#price-estimator" className="font-medium text-primary hover:underline">
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

      <button
        ref={launcherRef}
        type="button"
        onClick={isOpen ? closeChat : openChat}
        aria-expanded={isOpen}
        aria-controls="caraway-chat-panel"
        className="fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[201] inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/20 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--shadow-color)/0.28)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none sm:right-6 lg:bottom-6"
        aria-label={isOpen ? "Close Caraway chat" : "Open Caraway chat"}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span>{isOpen ? "Close" : "Ask Caraway"}</span>
      </button>
    </>
  );
}
