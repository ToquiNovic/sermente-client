// pages/surveys/SurveysPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Settings, Trash2, BarChart3 } from "lucide-react";
import { getSurveys, deleteSurveyById } from "./services";
import { Survey } from "@/models";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { DeleteCompanyDialog } from "./Components";

const SurveysPage = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  const handleDeleteClick = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSurvey) return;

    try {
      await deleteSurveyById(selectedSurvey.id);
      toast.success(`Encuesta "${selectedSurvey.title}" eliminada correctamente.`);
      setSurveys((prev) => prev.filter((s) => s.id !== selectedSurvey.id));
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast.error("Ocurrió un error al eliminar la encuesta.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSurvey(null);
    }
  };

  return (
    <ContentLayout title="Encuestas" icon={<BarChart3 />}>
      <TooltipProvider>
        <div className="w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Encuestas Disponibles</h1>
            <Button variant="outline" onClick={() => navigate("/surveys/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                className="shadow-lg rounded-lg relative flex flex-col justify-between h-full"
              >
                <CardHeader>
                  <CardTitle>{survey.title}</CardTitle>
                  <CardDescription>{survey.description}</CardDescription>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                        onClick={() => handleDeleteClick(survey)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar</TooltipContent>
                  </Tooltip>
                </CardHeader>

                <CardFooter className="flex justify-between mt-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/surveys/manage/${survey.id}`)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Gestionar</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* ✅ Diálogo personalizado para eliminar encuesta */}
        <DeleteCompanyDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleConfirmDelete}
          companyName={selectedSurvey?.title ?? ""}
        />
      </TooltipProvider>
    </ContentLayout>
  );
};

export default SurveysPage;
