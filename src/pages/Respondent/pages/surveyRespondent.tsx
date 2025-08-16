import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { NotebookPen } from "lucide-react";
import { QuestionsForm } from "../components";
import { QuestionsResponse } from "../type";
import { useEffect, useState } from "react";
import { getQuestionsBySurveyId } from "../service";
import { useParams } from "react-router-dom";

export const SurveyRespondentPage = () => {
  const id = useParams().id;
  const [data, setData] = useState<QuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(id);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestionsBySurveyId(
        "08626d27-f81f-4670-9e5c-f0c31517ed3a"
      );
      setData(data);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <ContentLayout
      title="Mis Encuestas"
      icon={<NotebookPen />}
      breadcrumbs={[{ label: "Encuestas", isCurrent: true }]}
    >
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Formulario dinámico</h1>
        {data && <QuestionsForm data={data} />}
      </div>
    </ContentLayout>
  );
};
