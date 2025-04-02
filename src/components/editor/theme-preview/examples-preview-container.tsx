import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
const LoadingSkeleton = () => (
  <div className="flex w-fit mx-auto flex-col space-y-3">
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

const ExamplesPreviewContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-6 mt-0 h-full">
        <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default ExamplesPreviewContainer;
