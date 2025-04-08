// @/pages/surveys/pages/CreateSurveyPage.tsx
import { BookOpen } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { MultiStepContainer } from "../Components";

export const CreateSurveyPage = () => {
  return (
    <ContentLayout title="Crear Encuesta" icon={<BookOpen />}>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen />
            <h1 className="text-2xl font-bold">Crear Nueva Encuesta</h1>
          </div>
        </div>
        <CardContent>
          <MultiStepContainer />
        </CardContent>
      </div>
    </ContentLayout>
  );
};
