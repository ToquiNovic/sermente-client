import { useFieldArray, useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import { v4 as uuidv4 } from "uuid";
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
import { Trash2 } from "lucide-react";

interface Props {
  categoryId: string;
}

export const SubcategoryTable = ({ categoryId }: Props) => {
  const { control, register } = useFormContext<SurveyFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `subcategories.${categoryId}` as const,
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input
                  {...register(`subcategories.${categoryId}.${index}.name`)}
                  placeholder="Nombre"
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

      <div className="text-right">
        <Button
          type="button"
          onClick={() =>
            append({
              id: uuidv4(),
              name: "",
              categoryId,
            })
          }
        >
          + Agregar subcategoría
        </Button>
      </div>
    </>
  );
};
