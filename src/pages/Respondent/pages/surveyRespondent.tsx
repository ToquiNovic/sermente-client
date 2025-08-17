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

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const data = await getQuestionsBySurveyId(id!);
      setData(data);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchQuestions();
  }
}, [id]);


  if (loading) return <div>Cargando...</div>;

  return (
    <ContentLayout
      title="Mis Encuestas"
      icon={<NotebookPen />}
      breadcrumbs={[{ label: "Encuestas", href: "/respondent" },
        { label: "Responder: ", isCurrent: true }
      ]}
    >
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Formulario dinámico</h1>
        {data && <QuestionsForm data={data} />}
      </div>
    </ContentLayout>
  );
};
