import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../services";
import { SubCategoryForm, SubcategoryBase } from "../Models";

interface CategoryAccordionProps {
  category: {
    id: string;
    name: string;
    description: string;
    surveyId: string;
    subcategories: SubcategoryBase[];
  };
  onSubcategoriesChange: (
    categoryId: string,
    updatedSubcategories: SubcategoryBase[]
  ) => void;
}

export const CategoryAccordion = ({
  category,
  onSubcategoriesChange,
}: CategoryAccordionProps) => {
  const categoryId = category.id;
  const { control, register, setValue, getValues } = useForm<SubCategoryForm>({
    defaultValues: {
      subcategories: category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name || "",
        categoryId: categoryId,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
    keyName: "fieldId",
  });

  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const isEditing = (index: number) => editingRows.includes(index);

  const handleEdit = (index: number) => {
    setEditingRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSaveSubCategory = async (index: number) => {
    const subcategory = getValues().subcategories[index];

    if (!subcategory.name.trim()) {
      toast.error("El nombre de la subcategoría no puede estar vacío.");
      return;
    }

    try {
      if (subcategory.id) {
        await updateSubcategory({
          id: subcategory.id,
          name: subcategory.name,
        });
      } else {
        const newSub = await createSubcategory({
          name: subcategory.name,
          categoryId: categoryId,
        });
        setValue(`subcategories.${index}.id`, newSub.id);
      }

      toast.success("Subcategoría guardada exitosamente.");
      setEditingRows((prev) => prev.filter((i) => i !== index));

      const updated = getValues().subcategories.map((sub) => ({
        id: sub.id!,
        name: sub.name,
      })) as SubcategoryBase[];
      onSubcategoriesChange(categoryId, updated);
    } catch (error) {
      toast.error("Error al guardar la subcategoría.");
      console.error(error);
    }
  };

  const handleDeleteSubcategory = (index: number) => {
    const subcategory = getValues().subcategories[index];

    if (!subcategory.name || subcategory.name.trim() === "") {
      remove(index);
      setEditingRows((prev) => prev.filter((i) => i !== index));
    } else {
      setDeleteIndex(index);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const subcategory = getValues().subcategories[deleteIndex];

    try {
      if (subcategory?.id) {
        await deleteSubcategory(subcategory.id);
        toast.success("Subcategoría eliminada del servidor.");
      }

      remove(deleteIndex);
      const updated = getValues()
        .subcategories.filter((_, index) => index !== deleteIndex)
        .map((sub) => ({
          id: sub.id!,
          name: sub.name,
        })) as SubcategoryBase[];
      onSubcategoriesChange(categoryId, updated);

      setEditingRows((prev: number[]) =>
        prev.filter((i: number) => i !== deleteIndex)
      );
    } catch (error) {
      toast.error("Error al eliminar la subcategoría.");
      console.error(error);
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleAddSubCategory = () => {
    const newIndex = fields.length;
    append({ id: "", name: "", categoryId });
    setEditingRows((prev) => [...prev, newIndex]);
  };

  const subcategoryToDelete =
    deleteIndex !== null ? getValues().subcategories[deleteIndex] : null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Gestionar Subcategorías</h2>
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
                className="text-center text-muted-foreground py-6"
              >
                No hay subcategorías registradas aún.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.fieldId}>
                <TableCell>
                  <Input
                    {...register(`subcategories.${index}.name`)}
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
                        onClick={() => handleSaveSubCategory(index)}
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
                      onClick={() => handleDeleteSubcategory(index)}
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
        <Button type="button" onClick={handleAddSubCategory}>
          Añadir subcategoría
        </Button>
      </div>

      <Dialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar subcategoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            ¿Estás seguro de eliminar la subcategoría "
            <strong>{subcategoryToDelete?.name}</strong>"?
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
