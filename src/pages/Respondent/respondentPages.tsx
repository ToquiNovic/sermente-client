import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { NotebookPen } from "lucide-react";
import { getSurveyAsignments } from "./service";
import { useEffect, useState } from "react";
import { Survey } from "./type";

export const RespondentPage = () => {
  const [data, setData] = useState<Survey[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const surveys = await getSurveyAsignments(
        "6f5fe876-cf84-422a-8bf6-496fd54a6e42"
      );
      setData(surveys);
    } catch (error) {
      console.error("Error al obtener asignaciones de encuestas:", error);
      setData(null); // 👈 null indica error real
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

        {loading ? (
          <div>Cargando...</div>
        ) : !data ? (
          <div>Error al cargar encuestas.</div>
        ) : data.length === 0 ? (
          <div>No se tienes encuestas asignadas.</div>
        ) : (
          data.map((survey) => (
            <div key={survey.id}>
              <h2 className="text-xl font-bold">{survey.title}</h2>
              <p className="text-gray-500">{survey.description}</p>
            </div>
          ))
        )}
      </div>
    </ContentLayout>
  );
};
