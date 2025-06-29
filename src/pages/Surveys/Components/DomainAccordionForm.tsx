import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DomainTable } from "./DomainTable";
import { useEffect } from "react";

export const DomainAccordionForm = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const data = getValues();
  
  useEffect(() => {
    const data = getValues();
    const allDomains = data.factors.flatMap((f) => f.domains ?? []);
    console.log("✅ Dominios del formulario:", allDomains);
  }, [getValues]);

  return (
    <Accordion type="multiple" className="w-full">
      {data.factors.map((factor, factorIndex) => (
        <AccordionItem key={factor.id} value={factor.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex justify-between w-full px-2 text-left">
              <span className="font-medium">{factor.name}</span>
              <span className="text-muted-foreground">
                {factor.description}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-50 p-4 space-y-4">
            <DomainTable factorIndex={factorIndex} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
