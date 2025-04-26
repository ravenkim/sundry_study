import { useState, useCallback } from "react";
import { type ThemeStyles } from "@/types/theme";
import { toast } from "@/components/ui/use-toast";
import {
  createTheme as createThemeAction,
  updateTheme as updateThemeAction,
  deleteTheme as deleteThemeAction,
} from "@/actions/themes";
import { Theme } from "@/types/theme";
import { tryCatch } from "@/utils/try-catch";
import { useThemePresetStore } from "@/store/theme-preset-store";

type MutationState<T> = {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
};

type ThemeMutationResult = {
  success: boolean;
  theme?: Theme;
  error?: string;
  details?: any;
};

const handleMutationError = (
  error: any,
  setError: (error: Error | null) => void,
  setIsAuthRequired: (value: boolean) => void
) => {
  console.error("Mutation error:", error);

  if (error.message === "Unauthorized") {
    setIsAuthRequired(true);
    toast({
      title: "Authentication Required",
      description: "Please sign in to continue.",
      variant: "default",
    });
  } else {
    setError(error);
    toast({
      title: "Operation Failed",
      description: error.message || "An unexpected error occurred.",
      variant: "destructive",
    });
  }
};

const handleMutationSuccess = (theme: Theme | undefined, operation: string) => {
  if (theme) {
    toast({
      title: `Theme ${operation}`,
      description: `Theme "${
        theme.name
      }" ${operation.toLowerCase()} successfully.`,
    });
  }
};

// --- Generic Fetcher ---
// A generic fetcher function to handle different methods and bodies
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use status text
      errorData = { error: response.statusText || "Request failed" };
    }
    // Include status code in the error object for better handling
    const error: any = new Error(
      errorData?.error || `An error occurred: ${response.status}`
    );
    error.status = response.status;
    error.info = errorData; // Attach full error info if available
    throw error;
  }
  // Handle cases where the response might be empty (e.g., DELETE 204)
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as unknown as T;
  }
  return response.json();
}

export function useThemeActions() {
  const { registerPreset, updatePreset, unregisterPreset } =
    useThemePresetStore();
  const [isAuthRequired, setIsAuthRequired] = useState(false);

  const [createState, setCreateState] = useState<MutationState<Theme>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const [updateState, setUpdateState] = useState<MutationState<Theme>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const [deleteState, setDeleteState] = useState<MutationState<boolean>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const executeMutation = async <T>(
    action: () => Promise<ThemeMutationResult>,
    setState: React.Dispatch<React.SetStateAction<MutationState<T>>>,
    successHandler: (result: ThemeMutationResult) => T | null
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setIsAuthRequired(false);

    const [error, result] = await tryCatch(action());

    if (error) {
      handleMutationError(
        error,
        (err) =>
          setState((prev) => ({ ...prev, error: err, isLoading: false })),
        setIsAuthRequired
      );
      return null;
    }

    if (result.success) {
      const data = successHandler(result);
      setState((prev) => ({ ...prev, isLoading: false, data }));
      return data;
    } else {
      const error = new Error(result.error || "Operation failed");
      setState((prev) => ({ ...prev, isLoading: false, error }));
      toast({
        title: "Operation Failed",
        description: result.error || "Could not complete the operation.",
        variant: "destructive",
      });
      return null;
    }
  };

  const createTheme = useCallback(
    async (data: { name: string; styles: ThemeStyles }) => {
      return executeMutation<Theme>(
        () => createThemeAction(data),
        setCreateState,
        (result) => {
          if (result.theme) {
            const theme: Theme = result.theme;
            handleMutationSuccess(theme, "Created");
            registerPreset(theme.id, {
              label: theme.name,
              source: "SAVED",
              createdAt: theme.createdAt.toISOString(),
              styles: theme.styles,
            });
            return theme;
          }
          return null;
        }
      );
    },
    []
  );

  const updateTheme = useCallback(
    async (data: { id: string; name?: string; styles?: ThemeStyles }) => {
      return executeMutation<Theme>(
        () => updateThemeAction(data),
        setUpdateState,
        (result) => {
          if (result.theme) {
            const theme: Theme = result.theme;
            handleMutationSuccess(theme, "Updated");
            updatePreset(theme.id, {
              label: theme.name,
              source: "SAVED",
              createdAt: theme.createdAt.toISOString(),
              styles: theme.styles,
            });
            return theme;
          }
          return null;
        }
      );
    },
    []
  );

  const deleteTheme = useCallback(async (themeId: string) => {
    return executeMutation<boolean>(
      () => deleteThemeAction(themeId),
      setDeleteState,
      (result) => {
        if (result.success) {
          handleMutationSuccess(result.theme, "Deleted");
          unregisterPreset(themeId);
          toast({
            title: "Theme Deleted Successfully",
          });
          return true;
        }
        return false;
      }
    );
  }, []);

  return {
    createTheme,
    updateTheme,
    deleteTheme,
    isCreatingTheme: createState.isLoading,
    isUpdatingTheme: updateState.isLoading,
    isDeletingTheme: deleteState.isLoading,
    createError: createState.error,
    updateError: updateState.error,
    deleteError: deleteState.error,
    isMutating:
      createState.isLoading || updateState.isLoading || deleteState.isLoading,
    mutationError: createState.error || updateState.error || deleteState.error,
    isAuthRequired,
    setIsAuthRequired,
  };
}
