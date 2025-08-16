import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Fragment } from "react";

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrent?: boolean;
  icon?: React.ReactNode;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItemProps[];
}

export function CustomBreadcrumb({ items }: CustomBreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItemProps[] = [
    { label: "Inicio", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
    ...items,
  ];

  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map(({ label, href, isCurrent, icon }, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <Fragment key={label}>
              <BreadcrumbItem>
                {isCurrent || isLast ? (
                  <BreadcrumbPage>{icon || label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={href || "#"}>{icon || label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
