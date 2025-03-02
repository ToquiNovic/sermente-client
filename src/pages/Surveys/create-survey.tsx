import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { SurveyFormData, TypeSurvey } from "@/models";
import { getAllTypesSurvey, createSurvey } from "./services";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type SurveyRequest = SurveyFormData & { createdBy: string };

export const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const [typeSurveys, setTypeSurveys] = useState<TypeSurvey[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.id);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      typeSurveyId: "",
    },
  });

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
      form.reset();
      navigate("/surveys");
    } catch {
      toast.error("Error al crear la encuesta. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg p-6">
      <CardHeader>
        <CardTitle>Crear Nueva Encuesta</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Encuesta de satisfacción" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ej: Evaluación de la calidad del servicio..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y Hora Límite</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeSurveyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Encuesta</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeSurveys.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/surveys")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Encuesta"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
