import type { Metadata } from "next";
import Accessibility from "@/views/Accessibility";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Caraway's commitment to making our website accessible to everyone.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <Accessibility />;
}
