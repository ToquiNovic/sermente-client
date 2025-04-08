import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Category } from "../../Models";

interface StepTwoProps {
  setIsStepValid: (isValid: boolean) => void;
  setTitle: (title: string) => void;
}

export const StepTwo = ({ setIsStepValid, setTitle }: StepTwoProps) => {
  const { control, register, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  // 🧠 Observa datos relevantes
  const title = watch("title");
  const id = watch("id");
  const categories = watch("categories");

  // ✅ Mostrar en consola al entrar
  useEffect(() => {
    console.log("📝 Paso 1 - Título:", title);
    console.log("🆔 ID de encuesta (watch):", id);
  }, [title, id]);

  // ✅ Actualiza el título del paso
  useEffect(() => {
    setTitle(title || "");
  }, [title, setTitle]);

  // ✅ Validación en tiempo real
  useEffect(() => {
    const hasAtLeastOneValid = Array.isArray(categories)
      ? categories.some((cat: Category) => cat?.name?.trim() !== "")
      : false;

    setIsStepValid(hasAtLeastOneValid);
  }, [categories, setIsStepValid]);

  const handleAddEmptyRow = () => {
    append({ name: "", description: "" });
  };

  return (
    <Card className="p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold">Categorías</h2>

      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/3 font-medium text-gray-700">Nombre</TableHead>
            <TableHead className="w-1/3 font-medium text-gray-700">Descripción</TableHead>
            <TableHead className="w-12 text-center font-medium text-gray-700">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input
                  {...register(`categories.${index}.name`)}
                  placeholder="Nombre"
                />
              </TableCell>
              <TableCell>
                <Input
                  {...register(`categories.${index}.description`)}
                  placeholder="Descripción"
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 text-right">
        <Button type="button" onClick={handleAddEmptyRow}>
          + Agregar categoría
        </Button>
      </div>
    </Card>
  );
};
