// pages/survey/create-survey.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAllTypesSurvey, createSurvey } from "./services";
import { SurveyFormData, TypeSurvey } from "@/models";
import { RootState } from "@/redux/store";

// Esquema de validación con Zod
const surveySchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
  deadline: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Fecha y hora inválidas."),
  typeSurveyId: z.string().min(1, "Debes seleccionar un tipo de encuesta."),
});

// Tipo en TypeScript basado en el esquema de Zod
type SurveyRequest = SurveyFormData & { createdBy: string };

const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const [typeSurveys, setTypeSurveys] = useState<TypeSurvey[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
  });

  // Cargar los tipos de encuestas desde la API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getAllTypesSurvey();
        setTypeSurveys(types);
      } catch {
        toast.error("Error cargando los tipos de encuestas.");
      }
    };
    fetchTypes();
  }, []);

  const onSubmit = async (data: SurveyFormData) => {
    if (!userId) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }

    setLoading(true);
    try {
      const surveyData: SurveyRequest = { ...data, createdBy: userId };
      await createSurvey(surveyData);
      toast.success(`Encuesta "${data.title}" creada con éxito.`);
      reset();
      navigate("/surveys");
    } catch {
      toast.error("Error al crear la encuesta. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-full max-w-lg shadow-lg p-4">
        <CardHeader>
          <CardTitle>Crear Nueva Encuesta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Ej: Encuesta de satisfacción"
              />
              {errors.title?.message && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Ej: Evaluación de la calidad del servicio..."
              />
              {errors.description?.message && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Campo de fecha y botón para cambiarla */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="deadline">Fecha y Hora Límite</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  {...register("deadline")}
                  value={watch("deadline") || ""}
                  readOnly
                />
                {errors.deadline?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.deadline.message}
                  </p>
                )}
              </div>
            </div>

            {/* Select para el tipo de encuesta */}
            <div>
              <Label htmlFor="typeSurvey">Tipo de Encuesta</Label>
              <select
                id="typeSurvey"
                {...register("typeSurveyId")}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Seleccione un tipo</option>
                {typeSurveys.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.typeSurveyId?.message && (
                <p className="text-red-500 text-sm">
                  {errors.typeSurveyId.message}
                </p>
              )}
            </div>

            <CardFooter className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/surveys")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Encuesta"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSurveyPage;
