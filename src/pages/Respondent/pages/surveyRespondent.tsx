import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { NotebookPen } from "lucide-react";
import { SingleQuestionForm, SurveyProgress } from "../components";
import { QuestionsResponse, Survey } from "../type";
import { useEffect, useState } from "react";
import { getQuestionsBySurveyId, getSurveyById } from "../service";
import { useParams } from "react-router-dom";

export const SurveyRespondentPage = () => {
  const id = useParams().id;
  const [data, setData] = useState<QuestionsResponse | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(0);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsBySurveyId(id!);
        const survey = await getSurveyById(id!);
        setSurvey(survey);
        setData(data?.questions ? data : null);
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

  const totalQuestions =
    data?.questions.flatMap((factor) =>
      factor.domains.flatMap((domain) =>
        domain.dimensions.flatMap((dim) => dim.questions)
      )
    ).length || 0;

  const factors = data?.questions ?? [];

  if (loading) return <div>Cargando...</div>;

  const handleAnswers = (answers: Record<string, string>) => {
    const newAnsweredCount = Object.keys(answers).length;
    if (newAnsweredCount > answered) {
      setAnimateProgress(true);
      setAnswered(newAnsweredCount);
      setTimeout(() => setAnimateProgress(false), 300);
    }
  };

  return (
    <ContentLayout
      title="Mis Encuestas"
      icon={<NotebookPen />}
      breadcrumbs={[
        { label: "Encuestas", href: "/respondent" },
        { label: `Responder: ${survey?.title}`, isCurrent: true },
      ]}
    >
      <div className="flex flex-col justify-center py-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{survey?.title}</h1>

        {/* Barra de progreso */}
        {data && (
          <SurveyProgress
            current={answered}
            total={totalQuestions}
            factors={factors}
            animate={animateProgress}
          />
        )}

        {/* Formulario */}
        {data && <SingleQuestionForm data={data} onAnswer={handleAnswers} />}
      </div>
    </ContentLayout>
  );
};
