import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThemeNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Theme Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The theme you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
