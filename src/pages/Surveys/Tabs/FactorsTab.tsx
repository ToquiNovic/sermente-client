import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Save, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FactorFrom, GetFactorsResponse, Factor } from "../types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getFactorsbySurveyId,
  createFactor,
  updateFactor,
  deleteFactor,
} from "../services";
import { Label } from "@/components/ui/label";

interface FactorsTabProps {
  surveyId: string;
}

export const FactorsTab = ({ surveyId }: FactorsTabProps) => {
  const { control, register } = useForm<FactorFrom>({
    defaultValues: {
      factors: [],
    },
  });

  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "factors",
    keyName: "fieldId",
  });

  const fetchFactors = useCallback(async () => {
    try {
      const response = (await getFactorsbySurveyId(
        surveyId
      )) as GetFactorsResponse;
      const factors = response.factors || [];

      const mapped = factors.map((cat: Factor, idx: number) => ({
        id: cat.id,
        name: cat.name || "",
        description: cat.description || "",
        position: typeof cat.position === "number" ? cat.position : idx,
      }));

      replace(mapped);
    } catch (error) {
      toast.error("Error al cargar las categorías");
      console.error(error);
    }
  }, [surveyId, replace]);

  useEffect(() => {
    fetchFactors();
  }, [fetchFactors]);

  const isEditing = (index: number) => editingRows.includes(index);

  const handleEdit = (index: number) => {
    setEditingRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSaveFactor = async (index: number) => {
    const factor = control._formValues.factors[index];

    if (!factor.name.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío.");
      return;
    }

    const position =
      typeof factor.position === "string"
        ? parseInt(factor.position, 10)
        : factor.position;
    if (isNaN(position)) {
      toast.error("La posición debe ser un número válido.");
      return;
    }

    try {
      if (factor.id) {
        await updateFactor({
          id: factor.id,
          name: factor.name,
          description: factor.description,
          position,
        });
      } else {
        await createFactor({
          name: factor.name,
          description: factor.description,
          position,
          surveyId,
        });
      }

      setEditingRows((prev) => prev.filter((i) => i !== index));
      fetchFactors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFactorDelete = (index: number) => {
    const factor = control._formValues.factors[index];

    const isEmpty =
      (!factor.name || factor.name.trim() === "") &&
      (!factor.description || factor.description.trim() === "");

    if (isEmpty) {
      remove(index);
      setEditingRows((prev) => prev.filter((i) => i !== index));
    } else {
      setDeleteIndex(index);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    setLoadingDelete(true); // Activamos loading

    const factor = control._formValues.factors[deleteIndex];

    try {
      if (factor?.id) {
        await deleteFactor(factor.id);
      }

      remove(deleteIndex);
      setEditingRows((prev) => prev.filter((i) => i !== deleteIndex));
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el factor");
    } finally {
      setDeleteIndex(null);
      setLoadingDelete(false);
    }
  };

  const handleAddFactor = () => {
    const lastPosition = fields.reduce((max, field) => {
      const pos =
        typeof field.position === "string"
          ? parseInt(field.position, 10)
          : field.position;
      return !isNaN(pos) && pos > max ? pos : max;
    }, -1);

    const newPosition = lastPosition + 1;

    const newIndex = fields.length;
    append({ name: "", description: "", position: newPosition });
    setEditingRows((prev) => [...prev, newIndex]);
  };

  const factorToDelete =
    deleteIndex !== null ? control._formValues.factors[deleteIndex] : null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Gestionar Factores</h2>
      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/4 font-medium text-gray-700">
              Posicion
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
          {fields.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-6"
              >
                No hay categorías registradas aún.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.fieldId}>
                <TableCell className="w-1/4">
                  <Input
                    {...register(`factors.${index}.position`)}
                    placeholder="Posicion"
                    disabled={!isEditing(index)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`factors.${index}.name`)}
                    placeholder="Nombre"
                    disabled={!isEditing(index)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`factors.${index}.description`)}
                    placeholder="Descripción"
                    disabled={!isEditing(index)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    {isEditing(index) ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveFactor(index)}
                      >
                        <Save className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFactorDelete(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={handleAddFactor}>
          Añadir Factor
        </Button>
      </div>

      <Dialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <Label>
            ¿Estás seguro de eliminar la categoría "
            <strong>{factorToDelete?.name}</strong>"?
          </Label>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteIndex(null)}
              disabled={loadingDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
