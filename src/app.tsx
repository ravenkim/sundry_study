import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { PostHogProvider } from "posthog-js/react";

const queryClient = new QueryClient();
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Outlet />
        </TooltipProvider>
      </QueryClientProvider>
    </PostHogProvider>
  </ThemeProvider>
);

export default App;
