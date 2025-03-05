import { Navbar } from "@/components/app/sidebar/navbar";
import { Breadcrumb } from "@/components";
import { Card } from "@/components/ui/card";

interface ContentLayoutProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ContentLayout({ title, icon, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} icon={icon} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">
        <Breadcrumb />
        <Card className="p-6">
          {children}
        </Card>
      </div>
    </div>
  );
}
