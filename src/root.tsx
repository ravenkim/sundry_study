import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import App from "./app"; // Import the main App component
import posthog from "posthog-js";
import { useEffect } from "react";
import themeInitScriptContent from "/public/scripts/theme-init.js?raw";

function PosthogInit() {
  useEffect(() => {
    // Ensure PostHog key exists before initializing
    const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host:
          import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://app.posthog.com", // Provide default
      });
    } else {
      console.warn("PostHog key is missing, skipping initialization.");
    }
  }, []);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inline the theme initialization script */}
        {/* Placed very early to block rendering until it runs */}
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScriptContent }}
          suppressHydrationWarning
        />
        <meta charSet="UTF-8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <PosthogInit />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Default export remains the same
export default function Root() {
  return <App />;
}
