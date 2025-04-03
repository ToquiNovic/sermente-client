import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { SurveyFormData } from "@/models";
import { createSurvey } from "../services";
import { CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { MultiStepContainer } from "../Components";

export const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user?.id);

  const onSubmit = async (data: SurveyFormData) => {
    if (!userId) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }

    try {
      await createSurvey({ ...data });
      toast.success(`Encuesta "${data.title}" creada con éxito.`);
      navigate("/surveys");
    } catch {
      toast.error("Error al crear la encuesta. Inténtalo nuevamente.");
    }
  };

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
          <MultiStepContainer onSubmit={onSubmit} />
        </CardContent>
      </div>
    </ContentLayout>
  );
};
