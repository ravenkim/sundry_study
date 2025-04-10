import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { PostHogProvider } from "posthog-js/react";
import Home from "./pages/home";
import { HelmetProvider } from "react-helmet-async";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import Index from "./pages/index";

const queryClient = new QueryClient();
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

const App = () => (
  <NuqsAdapter>
    <ThemeProvider defaultTheme="light">
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor/theme" element={<Index />} />
              </Routes>
            </TooltipProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  </NuqsAdapter>
);

export default App;
