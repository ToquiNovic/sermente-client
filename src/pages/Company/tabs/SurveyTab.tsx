import { useEffect, useState } from "react";
import { getSurveyAsignmentsbyCompanyId } from "../services";
import { Survey } from "@/models";
interface SurveyTabProps {
  companyId: string;
}
export const SurveyTab = ({ companyId }: SurveyTabProps) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getSurveyAsignmentsbyCompanyId(companyId);
        console.log("data:", data);

        // Asegurarse de que siempre sea un arreglo
        const surveysArray = Array.isArray(data) ? data : data?.surveys ?? [];
        setSurveys(surveysArray);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchCompany();
  }, [companyId]);

  console.log("CompanyId:", companyId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mis Encuestas</h1>
      {surveys.length === 0 ? (
        <div>No tienes encuestas asignadas.</div>
      ) : (
        surveys.map((survey) => <div key={survey.id}>{survey.title}</div>)
      )}
    </div>
  );
};
