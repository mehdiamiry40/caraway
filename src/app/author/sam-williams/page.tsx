import { permanentRedirect } from "next/navigation";

export default function RetiredAuthorPage() {
  permanentRedirect("/about");
}
