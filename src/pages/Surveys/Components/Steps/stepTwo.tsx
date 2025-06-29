import { useEffect } from "react";
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
import { Factor } from "../../types";

interface StepTwoProps {
  setIsStepValid: (isValid: boolean) => void;
  setTitle: (title: string) => void;
}

export const StepTwo = ({ setIsStepValid, setTitle }: StepTwoProps) => {
  const { control, register, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "factors",
  });

  const title = watch("title");
  const id = watch("id");
  const watchedFactors = useWatch({ control, name: "factors" });

  useEffect(() => {
    console.log("📝 Paso 1 - Título:", title);
    console.log("🆔 ID de encuesta (watch):", id);
  }, [title, id]);

  useEffect(() => {
    setTitle(title || "");
  }, [title, setTitle]);

  useEffect(() => {
    const factorList: Factor[] = Array.isArray(watchedFactors)
      ? watchedFactors
      : [];

    const isValid =
      factorList.length >= 1 &&
      factorList.every(
        (factor) =>
          typeof factor?.name === "string" && factor.name.trim() !== ""
      );
    setIsStepValid(isValid);

    console.log("📋 Factores actuales:", factorList);
  }, [watchedFactors, setIsStepValid]);

  const handleAddEmptyRow = () => {
    append({ id: uuidv4(), name: "", description: "" });
  };

  return (
    <Card className="p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold">Factores</h2>
      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/4 font-medium text-gray-700">
              Posición
            </TableHead>
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
              <TableCell className="w-1/4">
                <Input
                  {...register(`factors.${index}.position`)}
                  placeholder="Posición"
                />
              </TableCell>
              <TableCell>
                <Input
                  {...register(`factors.${index}.name`)}
                  placeholder="Nombre"
                />
              </TableCell>
              <TableCell>
                <Input
                  {...register(`factors.${index}.description`)}
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

      {watchedFactors?.length === 0 && (
        <p className="text-red-500 text-sm">
          Debes agregar al menos un factor.
        </p>
      )}

      {watchedFactors?.some((fact: Factor) => !fact?.position) && (
        <p className="text-red-500 text-sm">
          El campo "Posición" es obligatorio para todos los factores.
        </p>
      )}

      {watchedFactors?.some((fact: Factor) => !fact?.name?.trim()) && (
        <p className="text-red-500 text-sm">
          El campo "Nombre" es obligatorio para todas los factores.
        </p>
      )}

      <div className="mt-4 text-right">
        <Button type="button" onClick={handleAddEmptyRow}>
          + Agregar Factor
        </Button>
      </div>
    </Card>
  );
};
