import { Sidebar } from "@/components/app/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useSidebar } from "@/hooks";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export default function AdminPanelLayout() {
  const sidebar = useSidebar();

  if (!sidebar) return null;

  const { isOpen, settings } = sidebar;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          !settings?.disabled && (!isOpen ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <Outlet /> 
        <Toaster />
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          !settings?.disabled && (!isOpen ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        {/* <Footer /> */}
      </footer>
    </>
  );
}

