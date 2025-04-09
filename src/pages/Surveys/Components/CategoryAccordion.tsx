// @/pages/surveys/components/CategoryAccordion.tsx
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface CategoryAccordionProps {
  category: Category;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const handleAdd = () => {
    setSubcategories((prev) => [
      ...prev,
      { id: uuidv4(), name: "", categoryId: category.id },
    ]);
  };

  const handleRemove = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    setSubcategories((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, name: value } : sub))
    );
  };

  return (
    <AccordionItem value={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between w-full px-2 text-left">
          <span className="font-medium">{category.name}</span>
          <span className="text-muted-foreground">{category.description}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-gray-50 p-4 space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((sub, index) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <Input
                    value={sub.name}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="Nombre"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="text-right">
          <Button type="button" onClick={handleAdd}>
            + Agregar subcategoría
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
