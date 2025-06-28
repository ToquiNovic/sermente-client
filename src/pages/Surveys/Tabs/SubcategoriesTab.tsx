// @/pages/surveys/components/SubcategoriesTab.tsx
import { useEffect, useState, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CategoryAccordion } from "../Components";
import { getSubcategoriesBySurveyId } from "../services";
import { SubcategoryResponse } from "../Models";

interface SubcategoriesTabProps {
  surveyId: string;
}

const SubcategoriesTab = ({ surveyId }: SubcategoriesTabProps) => {
  const [categories, setCategories] = useState<SubcategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const data = await getSubcategoriesBySurveyId(surveyId);
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar subcategorías", err);
        setError("Error al cargar subcategorías");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [surveyId]);

  const handleSubcategoriesChange = useCallback(
    (
      categoryId: string,
      updatedSubcategories: SubcategoryResponse["subcategories"]
    ) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.idcategory === categoryId
            ? { ...cat, subcategories: updatedSubcategories }
            : cat
        )
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">
        Subcategorías por categoría
      </h3>

      {loading ? (
        <p className="text-muted-foreground">Cargando subcategorías...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {categories.map((cat) => (
            <AccordionItem key={cat.idcategory} value={cat.idcategory}>
              <AccordionTrigger>{cat.namecategory}</AccordionTrigger>
              <AccordionContent>
                <CategoryAccordion
                  category={{
                    id: cat.idcategory,
                    name: cat.namecategory,
                    description: "",
                    surveyId: surveyId,
                    subcategories: cat.subcategories,
                  }}
                  onSubcategoriesChange={handleSubcategoriesChange}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
export default SubcategoriesTab;
