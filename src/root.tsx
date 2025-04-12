import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import App from "./app"; // Import the main App component
import posthog from "posthog-js";
import { useEffect } from "react";

function PosthogInit() {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    });
  }, []);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          src="/scripts/theme-init.js"
          type="module"
          suppressHydrationWarning
        />
        <meta charSet="UTF-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <PosthogInit />
        {children}
        <ScrollRestoration />
        {/* Scripts component loads the main React bundle for hydration */}
        <Scripts />
        {/* IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! */}
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
      </body>
    </html>
  );
}

// Default export remains the same
export default function Root() {
  return <App />;
}
