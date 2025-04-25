import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PostLoginAction } from "@/hooks/use-post-login-action";

interface AuthStore {
  isOpen: boolean;
  mode: "signin" | "signup";
  postLoginAction: PostLoginAction;
  openAuthDialog: (
    mode?: "signin" | "signup",
    postLoginAction?: PostLoginAction
  ) => void;
  closeAuthDialog: () => void;
  clearPostLoginAction: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isOpen: false,
      mode: "signin",
      postLoginAction: null,
      openAuthDialog: (
        newMode?: "signin" | "signup",
        postLoginAction?: PostLoginAction
      ) => {
        set((state) => ({
          isOpen: true,
          mode: newMode || state.mode,
          postLoginAction: postLoginAction || null,
        }));
      },
      closeAuthDialog: () => {
        set({ isOpen: false });
      },
      clearPostLoginAction: () => {
        set({ postLoginAction: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ postLoginAction: state.postLoginAction }),
    }
  )
);
