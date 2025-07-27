import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { getDimensionsbySurveyId } from "../services";
import { FactorforDimension } from "../types";
import { DimensionAccordion } from "../Components";

interface DimensionsTabProps {
  surveyId: string;
}

export const DimensionsTab = ({ surveyId }: DimensionsTabProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [factors, setFactors] = useState<FactorforDimension[]>([]);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { factors } = await getDimensionsbySurveyId(surveyId);
        setFactors(factors || []);
      } catch (err) {
        console.error("Error al cargar dominios", err);
        setError("Error al cargar dominios");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [surveyId]);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-muted-foreground">
          Cargando Dimensiones de dominio...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        factors.map((factor) => (
          <div key={factor.id} className="space-y-2">
            <h3 className="text-lg font-semibold">
              {factor.position} - {factor.name}
            </h3>

            <Accordion type="multiple" className="w-full">
              {factor.domains && factor.domains.length > 0 ? (
                factor.domains.map((domain) => (
                  <AccordionItem key={domain.id} value={domain.id}>
                    <AccordionTrigger>{domain.name}</AccordionTrigger>
                    <AccordionContent>
                      <DimensionAccordion domain={domain} />
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No hay dominios disponibles.
                </p>
              )}
            </Accordion>
          </div>
        ))
      )}
    </div>
  );
};
