// @/pages/surveys/components/SubcategoriesTab.tsx
import { Accordion } from "@/components/ui/accordion";
import { CategoryAccordion } from "../Components";

// Simulación de categorías recibidas
const fakeCategories = [
  { id: "cat1", name: "Categoría A", description: "Descripción A" },
  { id: "cat2", name: "Categoría B", description: "Descripción B" },
];

const SubcategoriesTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">
        Subcategorías por categoría
      </h3>
      <Accordion type="multiple" className="w-full">
        {fakeCategories.map((cat) => (
          <CategoryAccordion key={cat.id} category={cat} />
        ))}
      </Accordion>
    </div>
  );
};

export default SubcategoriesTab;
