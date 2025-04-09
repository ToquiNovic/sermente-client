import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SubcategoryTable } from "./SubcategoryTable";

export const SubcategoryAccordion = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const data = getValues();

  return (
    <Accordion type="multiple" className="w-full">
      {data.categories.map((cat) => (
        <AccordionItem key={cat.id} value={cat.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex justify-between w-full px-2 text-left">
              <span className="font-medium">{cat.name}</span>
              <span className="text-muted-foreground">{cat.description}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-gray-50 p-4 space-y-4">
            <SubcategoryTable categoryId={cat.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
