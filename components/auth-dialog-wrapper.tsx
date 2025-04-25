"use client";

import { AuthDialog } from "@/app/(auth)/components/auth-dialog";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { executePostLoginAction } from "@/hooks/use-post-login-action";

export function AuthDialogWrapper() {
  const {
    isOpen,
    mode,
    closeAuthDialog,
    postLoginAction,
    clearPostLoginAction,
  } = useAuthStore();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (isOpen && session) {
      closeAuthDialog();
    }

    if (session && postLoginAction) {
      executePostLoginAction(postLoginAction);
      clearPostLoginAction();
    }
  }, [session, isOpen, closeAuthDialog, postLoginAction, clearPostLoginAction]);

  return (
    <AuthDialog
      open={isOpen}
      onOpenChange={closeAuthDialog}
      initialMode={mode}
    />
  );
}
