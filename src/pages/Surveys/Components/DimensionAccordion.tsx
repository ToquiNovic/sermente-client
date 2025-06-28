import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DomainforDimension } from "../types";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateDimension,
  createDimension,
  deleteDimension,
} from "../services";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DimensionAccordionProps {
  domain: DomainforDimension;
}

export const DimensionAccordion = ({ domain }: DimensionAccordionProps) => {
  const { control, register, setValue } = useForm({
    defaultValues: {
      dimensions: domain.dimensions || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dimensions",
    keyName: "fieldId",
  });

  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const isEditing = (index: number) => editingRows.includes(index);

  const handleEdit = (index: number) => {
    setEditingRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSaveDimension = async (index: number) => {
    const dimension = control._formValues.dimensions[index];

    if (!dimension.name.trim()) {
      toast.error("El nombre de la dimensión no puede estar vacío.");
      return;
    }

    try {
      if (dimension.id) {
        await updateDimension({
          id: dimension.id,
          name: dimension.name,
          domainId: domain.id,
        });
      } else {
        const newDimension = await createDimension({
          name: dimension.name,
          domainId: domain.id,
        });

        if (newDimension && newDimension.id) {
          setValue(`dimensions.${index}.id`, newDimension.id);
        }
      }

      setEditingRows((prev) => prev.filter((i) => i !== index));
    } catch (error) {
      toast.error("Ocurrió un error al guardar la dimensión.");
      console.error(error);
    }
  };

  const handleDeleteDimension = (index: number) => {
    const dimension = control._formValues.dimensions[index];

    const isEmpty =
      (!dimension.name || dimension.name.trim() === "") &&
      (!dimension.description || dimension.description.trim() === "");

    if (isEmpty) {
      remove(index);
      setEditingRows((prev) => prev.filter((i) => i !== index));
    } else {
      setDeleteIndex(index);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const dimension = control._formValues.dimensions[deleteIndex];

    try {
      if (dimension?.id) {
        await deleteDimension(dimension.id);
      }

      remove(deleteIndex);
      setEditingRows((prev) => prev.filter((i) => i !== deleteIndex));
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la dimensión.");
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleAddDimension = () => {
    const newIndex = fields.length;
    append({ name: "" });
    setEditingRows((prev) => [...prev, newIndex]);
  };

  const dimensionToDelete =
    deleteIndex !== null ? control._formValues.dimensions[deleteIndex] : null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Gestionar Dimensiones</h2>
      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-2/3 font-medium text-gray-700">
              Nombre
            </TableHead>
            <TableHead className="w-1/3 text-center font-medium text-gray-700">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-center text-muted-foreground py-4"
              >
                No hay dimensiones.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.fieldId}>
                <TableCell>
                  <Input
                    {...register(`dimensions.${index}.name`)}
                    placeholder="Nombre"
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
                        onClick={() => handleSaveDimension(index)}
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
                        onClick={() => handleDeleteDimension(index)}
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
        <Button type="button" onClick={handleAddDimension}>
          Añadir Dimension
        </Button>
      </div>

      <Dialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar Dimension?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            ¿Estás seguro de eliminar la dimensión "
            <strong>{dimensionToDelete?.name}</strong>"?
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
