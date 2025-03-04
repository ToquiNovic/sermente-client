import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { LayoutGrid } from "lucide-react";

const Dashboard = () => {
  return (
    <ContentLayout title="Dashboard" icon={<LayoutGrid />}>
      <div>Dashboard</div>
    </ContentLayout>
  );
};

export default Dashboard;
