import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Domain, Factor } from "../types";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { createDomain, deleteDomain, updateDomain } from "../services";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DomainAccordionProps {
  factor: Factor;
  onDomainsChange: (factorId: string, updatedDomains: Domain[]) => void;
}

export const DomainAccordion = ({
  factor,
  onDomainsChange,
}: DomainAccordionProps) => {
  const factorId = factor.id;

  type DomainsForm = { domains: Domain[] };

  const { control, register, setValue, getValues } = useForm<DomainsForm>({
    defaultValues: {
      domains:
        factor.domains?.map((domain) => ({
          id: domain.id,
          name: domain.name || "",
          position: typeof domain.position === "number" ? domain.position : 0,
          factorId: factorId ?? "",
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "domains",
    keyName: "fieldId",
  });

  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const isEditing = (index: number) => editingRows.includes(index);

  const handleEdit = (index: number) => {
    setEditingRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSaveDomain = async (index: number) => {
    const domain = control._formValues.domains[index];

    if (!domain.name.trim()) {
      toast.error("El nombre del dominio no puede estar vacío.");
      return;
    }

    try {
      if (domain.id) {
        await updateDomain({
          id: domain.id,
          name: domain.name,
          position: domain.position,
        });
      } else {
        const newDomain = await createDomain({
          name: domain.name,
          position: domain.position,
          factorId: factorId ?? "",
        });
        if (newDomain && newDomain.id) {
          setValue(`domains.${index}.id`, newDomain.id);
        }
      }

      setEditingRows((prev) => prev.filter((i) => i !== index));

      const updated = getValues().domains.map((domain) => ({
        id: domain.id!,
        name: domain.name,
        position: domain.position,
      }))
      onDomainsChange(factorId!, updated);

    } catch (error) {
      toast.error("Ocurrió un error al guardar el dominio.");
      console.error(error);
    } finally {
      setEditingRows((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleDeleteDomain = (index: number) => {
    const domain = control._formValues.domains[index];

    const isEmpty =
      (!domain.name || domain.name.trim() === "") &&
      (!domain.description || domain.description.trim() === "");

    if (isEmpty) {
      remove(index);
      setEditingRows((prev) => prev.filter((i) => i !== index));
    } else {
      setDeleteIndex(index);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const domain = control._formValues.domains[deleteIndex];

    try {
      if (domain?.id) {
        await deleteDomain(domain.id);
      }

      remove(deleteIndex);
      setEditingRows((prev) => prev.filter((i) => i !== deleteIndex));
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleAddDomain = () => {
    const newIndex = fields.length;
    append({ position: 0, name: "" });
    setEditingRows((prev) => [...prev, newIndex]);
  };

  const domainToDelete =
    deleteIndex !== null ? control._formValues.domains[deleteIndex] : null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Gestionar Dominios</h2>
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
                No hay dominios registrados aún.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.fieldId}>
                <TableCell>
                  <Input
                    {...register(`domains.${index}.name`)}
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
                        onClick={() => handleSaveDomain(index)}
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
                      onClick={() => handleDeleteDomain(index)}
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
        <Button type="button" onClick={handleAddDomain}>
          Añadir Dominio
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
            <strong>{domainToDelete?.name}</strong>"?
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
