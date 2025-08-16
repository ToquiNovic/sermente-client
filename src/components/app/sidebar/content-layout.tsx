import { NavbarSkeleton } from "@/components/app/sidebar/navbar-skeleton";
import { Card } from "@/components/ui/card";
import { CustomBreadcrumb, type BreadcrumbItemProps } from "@/components/Breadcrumb";
import { Navbar } from "@/components/app/sidebar/navbar";

interface ContentLayoutProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  breadcrumbs?: BreadcrumbItemProps[];
}

export function ContentLayout({
  title,
  icon,
  children,
  loading = false,
  breadcrumbs = [],
}: ContentLayoutProps) {
  return (
    <div>
      {loading ? <NavbarSkeleton /> : <Navbar title={title} icon={icon} />}
      <Card className="flex-1 flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 md:px-8 lg:px-16 relative rounded-none">
        {breadcrumbs.length > 0 && (
          <div className="py-2">
            <CustomBreadcrumb items={breadcrumbs} />
          </div>
        )}
        {children}
      </Card>
    </div>
  );
}
