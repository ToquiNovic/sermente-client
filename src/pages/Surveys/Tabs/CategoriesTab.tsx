// @/pages/surveys/Tabs/CategoriesTab.tsx
import { useEffect, useCallback, useState } from "react";
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
  getCategoriesbySurveyId,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services";

interface Category {
  id?: string;
  name: string;
  description: string;
}

interface CategoryForm {
  categories: Category[];
}

interface CategoriesTabProps {
  surveyId: string;
}

interface GetCategoriesResponse {
  message: string;
  categories: Category[];
}

const CategoriesTab = ({ surveyId }: CategoriesTabProps) => {
  const { control, register } = useForm<CategoryForm>({
    defaultValues: {
      categories: [],
    },
  });

  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "categories",
    keyName: "fieldId",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = (await getCategoriesbySurveyId(
        surveyId
      )) as GetCategoriesResponse;
      const categories = response.categories || [];

      const mapped = categories.map((cat: Category) => ({
        id: cat.id,
        name: cat.name || "",
        description: cat.description || "",
      }));

      if (mapped.length > 0) {
        replace(mapped);
      } else {
        replace([{ name: "", description: "" }]);
      }
    } catch (error) {
      toast.error("Error al cargar las categorías");
      console.error(error);
    }
  }, [surveyId, replace]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const isEditing = (index: number) => editingRows.includes(index);

  const handleEdit = (index: number) => {
    setEditingRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSaveCategory = async (index: number) => {
    const category = control._formValues.categories[index];

    if (!category.name.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío.");
      return;
    }

    try {
      if (category.id) {
        await updateCategory({
          id: category.id,
          name: category.name,
          description: category.description,
        });
      } else {
        await createCategory({
          name: category.name,
          description: category.description,
          surveyId,
        });
      }

      toast.success("Categoría guardada exitosamente.");
      setEditingRows((prev) => prev.filter((i) => i !== index));
      fetchCategories();
    } catch (error) {
      toast.error("Error al guardar la categoría.");
      console.error(error);
    }
  };

  const handleDeleteCategory = (index: number) => {
    const category = control._formValues.categories[index];

    const isEmpty =
      (!category.name || category.name.trim() === "") &&
      (!category.description || category.description.trim() === "");

    if (isEmpty) {
      remove(index);
      setEditingRows((prev) => prev.filter((i) => i !== index));
    } else {
      setDeleteIndex(index);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const category = control._formValues.categories[deleteIndex];

    try {
      if (category?.id) {
        await deleteCategory(category.id);
        toast.success("Categoría eliminada del servidor.");
      }

      remove(deleteIndex);
      setEditingRows((prev) => prev.filter((i) => i !== deleteIndex));
    } catch (error) {
      toast.error("Error al eliminar la categoría.");
      console.error(error);
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleAddCategory = () => {
    const newIndex = fields.length;
    append({ name: "", description: "" });
    setEditingRows((prev) => [...prev, newIndex]);
  };

  const categoryToDelete =
    deleteIndex !== null ? control._formValues.categories[deleteIndex] : null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Gestionar Categorías</h2>
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
            <TableRow key={field.fieldId}>
              <TableCell>
                <Input
                  {...register(`categories.${index}.name`)}
                  placeholder="Nombre"
                  disabled={!isEditing(index)}
                />
              </TableCell>
              <TableCell>
                <Input
                  {...register(`categories.${index}.description`)}
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
                      onClick={() => handleSaveCategory(index)}
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
                    onClick={() => handleDeleteCategory(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={handleAddCategory}>
          Añadir categoría
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
          <p className="text-sm text-gray-500">¿Estás seguro de eliminar la
            categoría "<strong>{categoryToDelete?.name}</strong>"?
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

export default CategoriesTab;
