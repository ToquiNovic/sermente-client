// pages/surveys/SurveysPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CalendarCog, Settings, Trash2, BarChart3 } from "lucide-react";
import { getSurveys, updateSurvey } from "./services";
import { Survey } from "@/models";
import { toast } from "sonner";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChangeDateDialog from "./ChangeDateDialog";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

const SurveysPage = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChangeDateDialogOpen, setIsChangeDateDialogOpen] = useState(false);
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

  const handleDelete = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSurvey) {
      toast.error(`Se eliminó la encuesta "${selectedSurvey.title}".`);
      setSurveys(surveys.filter((s) => s.id !== selectedSurvey.id));
    }
    setIsDeleteDialogOpen(false);
  };

  const handleChangeDate = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsChangeDateDialogOpen(true);
  };

  const handleUpdateDate = async (newDate: string) => {
    if (selectedSurvey) {
      try {
        const updatedSurvey = await updateSurvey({
          id: selectedSurvey.id,
          deadline: newDate,
        });

        setSurveys((prevSurveys) =>
          prevSurveys.map((s) =>
            s.id === updatedSurvey.id ? updatedSurvey : s
          )
        );
        toast.success(`Fecha actualizada para "${selectedSurvey.title}".`);
      } catch (error) {
        toast.error("Hubo un error al actualizar la fecha.");
        console.error("Error updating survey:", error);
      }
    }
    setIsChangeDateDialogOpen(false);
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
          {surveys.map((survey) => {
            const deadlineDate = new Date(survey.deadline);
            const daysLeft = differenceInDays(deadlineDate, new Date());
            const hoursLeft = differenceInHours(deadlineDate, new Date());
            const minutesLeft = differenceInMinutes(deadlineDate, new Date());
            const formattedDate = format(deadlineDate, "PPPP p", {
              locale: es,
            });

            return (
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
                        onClick={() => handleDelete(survey)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar</TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent className="flex flex-col justify-end flex-grow">
                  <p className="text-xs text-gray-500">
                    ⏳{" "}
                    {daysLeft > 0
                      ? `Faltan ${daysLeft} día(s)`
                      : hoursLeft > 0
                      ? `Faltan ${hoursLeft} hora(s)`
                      : minutesLeft > 0
                      ? `Faltan ${minutesLeft} minuto(s)`
                      : "Tiempo agotado"}
                  </p>
                  <p className="text-xs text-gray-400">📅 {formattedDate}</p>
                </CardContent>

                <CardFooter className="flex justify-between mt-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeDate(survey)}
                      >
                        <CalendarCog className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cambiar Fecha</TooltipContent>
                  </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/surveys/stats/${survey.id}`)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver Estadísticas</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* 🔴 Diálogo de Confirmación para Eliminar */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Estás seguro?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. Se eliminará la encuesta{" "}
                <b>{selectedSurvey?.title}</b> de forma permanente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ✅ Diálogo para cambiar la fecha */}
        <ChangeDateDialog
          open={isChangeDateDialogOpen}
          surveyId={selectedSurvey?.id ?? ""}
          onClose={() => setIsChangeDateDialogOpen(false)}
          onDateUpdated={handleUpdateDate}
        />
      </div>
    </TooltipProvider>
    </ContentLayout>
  );
};

export default SurveysPage;
