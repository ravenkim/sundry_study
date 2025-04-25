"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  themeName: z.string().min(1, "Theme name cannot be empty."),
});

interface ThemeSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (themeName: string) => Promise<void>;
  isSaving: boolean;
  initialThemeName?: string;
  ctaLabel?: string;
  title?: string;
  description?: string;
}

export function ThemeSaveDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
  initialThemeName = "",
  ctaLabel = "Save Theme",
  title = "Save Theme",
  description = "Enter a name for your theme so you can find it later.",
}: ThemeSaveDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeName: initialThemeName,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values.themeName);
  };

  useEffect(() => {
    if (open) {
      form.reset({ themeName: initialThemeName });
    }
  }, [open, initialThemeName, form]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="themeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Theme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
              >
                {isSaving || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  ctaLabel
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
