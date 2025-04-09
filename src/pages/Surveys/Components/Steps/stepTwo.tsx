import { useEffect, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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

  const title = watch("title");
  const id = watch("id");
  const watchedCategories = useWatch({ control, name: "categories" });

  const [localIsValid, setLocalIsValid] = useState(false);

  useEffect(() => {
    console.log("📝 Paso 1 - Título:", title);
    console.log("🆔 ID de encuesta (watch):", id);
  }, [title, id]);

  useEffect(() => {
    setTitle(title || "");
  }, [title, setTitle]);

  useEffect(() => {
    const categoryList: Category[] = Array.isArray(watchedCategories)
      ? watchedCategories
      : [];

    const isValid =
      categoryList.length >= 1 &&
      categoryList.every(
        (category) =>
          typeof category?.name === "string" && category.name.trim() !== ""
      );

    setLocalIsValid(isValid);
    setIsStepValid(isValid);

    console.log("📋 Categorías actuales:", categoryList);
  }, [watchedCategories, setIsStepValid]);

  const handleAddEmptyRow = () => {
    append({ id: uuidv4(), name: "", description: "" });
  };

  return (
    <Card className="p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold">Categorías</h2>

      <p className="text-sm text-gray-500">
        Estado de validación local: {localIsValid ? "Válido" : "No válido"}
      </p>

      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/3 font-medium text-gray-700">
              Nombre
            </TableHead>
            <TableHead className="w-1/3 font-medium text-gray-700">
              Descripción
            </TableHead>
            <TableHead className="w-12 text-center font-medium text-gray-700">
              Acciones
            </TableHead>
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

      {watchedCategories?.length === 0 && (
        <p className="text-red-500 text-sm">
          Debes agregar al menos una categoría.
        </p>
      )}

      {watchedCategories?.some((cat: Category) => !cat?.name?.trim()) && (
        <p className="text-red-500 text-sm">
          El campo "Nombre" es obligatorio para todas las categorías.
        </p>
      )}

      <div className="mt-4 text-right">
        <Button type="button" onClick={handleAddEmptyRow}>
          + Agregar categoría
        </Button>
      </div>
    </Card>
  );
};
