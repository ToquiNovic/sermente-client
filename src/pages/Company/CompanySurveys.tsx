import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListChecks, FileText, PlusCircle } from "lucide-react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface CompanySurveysProps {
  companyId: string;
}

export const CompanySurveys: React.FC<CompanySurveysProps> = ({ companyId }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(`/api/company/${companyId}/surveys`);
        setSurveys(response.data.surveys);
      } catch (_) {
        setError("No se pudieron cargar las encuestas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [companyId]);

  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg">
      <AccordionItem value="surveys">
        <div className="flex justify-between items-center p-3">
          <AccordionTrigger className="flex items-center gap-x-2">
            <ListChecks className="w-5 h-5" />
            Encuestas de la Empresa
          </AccordionTrigger>

          {/* Tooltip para agregar encuesta */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => navigate("/surveys/new")} className="text-gray-500 hover:text-black transition">
                  <PlusCircle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Agregar Encuesta</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <AccordionContent>
          {loading ? (
            <p className="p-2 text-sm text-gray-500">Cargando encuestas...</p>
          ) : error ? (
            <p className="p-2 text-sm text-red-500">{error}</p>
          ) : surveys.length > 0 ? (
            <ul className="space-y-2 p-2">
              {surveys.map((survey) => (
                <li key={survey.id} className="flex items-center gap-x-2 p-2 border-b last:border-none">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{survey.title}</p>
                    {survey.description && <p className="text-xs text-gray-500">{survey.description}</p>}
                    <p className="text-xs text-gray-400">
                      Creado el: {new Date(survey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 text-sm text-gray-500">No hay encuestas disponibles.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
