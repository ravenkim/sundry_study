import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateThemeWithReferences } from "@/lib/ai-theme-generator";

interface UseAIThemeGenerationProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAIThemeGeneration(props?: UseAIThemeGenerationProps) {
  const { onSuccess, onError } = props || {};
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateTheme = async (prompt: string, jsonPrompt: string) => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const themeStyles = await generateThemeWithReferences(
        prompt,
        jsonPrompt,
        {
          onSuccess: () => {
            toast({
              title: "Theme generated",
              description: "Your AI-generated theme has been applied",
            });
            onSuccess?.();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to generate theme. Please try again.",
              variant: "destructive",
            });
            onError?.(error);
          },
        }
      );

      return themeStyles;
    } catch (error) {
      // Error is already handled by the utility function
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateTheme,
    loading,
  };
}
