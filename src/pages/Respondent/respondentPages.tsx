import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { NotebookPen } from "lucide-react";
import { getSurveyAsignments } from "./service";
import { useEffect, useState, useCallback } from "react";
import { Survey } from "./type";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { SurveyCard } from "./components";

export const RespondentPage = () => {
  const [data, setData] = useState<Survey[] | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user.id);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSurveyAsignments(userId);
      console.log("Encuestas asignadas:", response);
      setData(response);
    } catch (error) {
      console.error("Error al obtener asignaciones de encuestas:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Cargando...</div>;
  if (data === null) return <div>Error al cargar encuestas.</div>;

  return (
    <ContentLayout
      title="Mis Encuestas"
      icon={<NotebookPen />}
      breadcrumbs={[{ label: "Encuestas", isCurrent: true }]}
    >
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Mis Encuestas</h1>
        {data.length === 0 ? (
          <div>No tienes encuestas asignadas.</div>
        ) : (
          data.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
        )}
      </div>
    </ContentLayout>
  );
};
