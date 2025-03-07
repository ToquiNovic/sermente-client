import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { CompanyList } from "./components";
import { Building2 } from "lucide-react";

export const CompanyPage = () => {
  return (
    <ContentLayout title="Dashboard" icon={<Building2 />}>
      <CompanyList />
    </ContentLayout>
  );
};

export default CompanyPage;
