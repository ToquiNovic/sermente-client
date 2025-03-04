import Hero from "./Hero";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

export const ComingSoon = () => {
  return (
    <ContentLayout title="Próximamente">
      <main className="h-screen min-h-fit">
      <Hero />
    </main>
    </ContentLayout>
  );
};
