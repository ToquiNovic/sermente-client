// @/components/app/sidebar/navbar-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export const NavbarSkeleton = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary h-14">
      <div className="mx-4 sm:mx-8 flex h-full items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-md lg:hidden" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </header>
  );
};
