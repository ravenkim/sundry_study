"use client";

import { useState, useEffect } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  trigger?: React.ReactNode; // Optional trigger element
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  trigger,
}: AuthDialogProps) {
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsSignIn(initialMode === "signin");
    }
  }, [open, initialMode]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/editor/theme",
      });
      console.log(data);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      // Handle error appropriately (e.g., show a toast notification)
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      const data = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/editor/theme",
      });
      console.log(data);
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      // Handle error appropriately
    } finally {
      setIsGithubLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl border-none">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            {isSignIn ? "Welcome back" : "Create account"}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {isSignIn
              ? "Sign in to your account to continue"
              : "Sign up to get started with tweakcn"}
          </p>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              size="lg"
              className="w-full hover:bg-primary/10 hover:text-foreground flex items-center justify-center gap-2"
              disabled={isGoogleLoading || isGithubLoading}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="h-5 w-5"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              <span className="font-medium">Continue with Google</span>
              {isGoogleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>

            <Button
              variant="outline"
              onClick={handleGithubSignIn}
              size="lg"
              className="w-full hover:bg-primary/10 hover:text-foreground flex items-center justify-center gap-2"
              disabled={isGoogleLoading || isGithubLoading}
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">Continue with GitHub</span>
              {isGithubLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </div>

          <div className="pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-muted px-2 text-muted-foreground">
                  {isSignIn ? "New to tweakcn?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isSignIn ? "Create an account" : "Sign in to your account"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
