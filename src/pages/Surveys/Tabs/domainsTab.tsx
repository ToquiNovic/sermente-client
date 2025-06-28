import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DomainAccordion } from "../Components";
import { useCallback, useEffect, useState } from "react";
import { getDomainsbySurveyId } from "../services";
import { Domain, Factor } from "../types";

interface DomainsTabProps {
  surveyId: string;
}

export const DomainsTab = ({ surveyId }: DomainsTabProps) => {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { factors } = await getDomainsbySurveyId(surveyId);
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

  const handleDomainsChange = useCallback(
    (factorId: string, updatedDomains: Domain[]) => {
      setFactors((prev) =>
        prev.map((factor) =>
          factor.id === factorId
            ? { ...factor, domains: updatedDomains }
            : factor
        )
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Dominios de Factores</h3>

      {loading ? (
        <p className="text-muted-foreground">
          Cargando Dimensiones de dominio...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {factors.map((factor) => (
            <AccordionItem key={factor.id} value={factor.id!}>
              <AccordionTrigger>{factor.position} - {factor.name}</AccordionTrigger>
              <AccordionContent>
                <DomainAccordion
                  factor={factor}
                  onDomainsChange={handleDomainsChange}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
