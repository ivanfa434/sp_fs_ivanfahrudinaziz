import NotFound from "@/components/NotFound";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - Project Management App",
  description: "The page you're looking for doesn't exist",
};

export default function NotFoundPage() {
  return (
    <NotFound
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
    />
  );
}
