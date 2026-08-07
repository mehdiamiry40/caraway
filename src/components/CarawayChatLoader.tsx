"use client";

import { useRef, useState } from "react";

import { CarawayChatLauncher } from "@/components/CarawayChatLauncher";

type ChatComponent = typeof import("@/components/CarawayChat").CarawayChat;

export function CarawayChatLoader() {
  const [Chat, setChat] = useState<ChatComponent | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  function loadChat() {
    if (Chat || loadPromiseRef.current) return;

    setStatus("loading");
    const loadPromise = import("@/components/CarawayChat")
      .then((module) => {
        setChat(() => module.CarawayChat);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
      })
      .finally(() => {
        loadPromiseRef.current = null;
      });
    loadPromiseRef.current = loadPromise;
  }

  if (Chat) return <Chat initiallyOpen />;

  return (
    <CarawayChatLauncher
      busy={status === "loading"}
      errorMessage={
        status === "error"
          ? "Chat could not open. Please try again or call Caraway."
          : undefined
      }
      onClick={loadChat}
    />
  );
}
