// Server component: Providers intentionally has no "use client" directive so
// that `children` is not forced into a client boundary. BackToTopButton is the
// only client-side island needed here, and it carries its own "use client"
// directive, making it self-contained.
import { BackToTopButton } from "@/components/BackToTopButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTopButton />
    </>
  );
}
