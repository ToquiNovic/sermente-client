// @/pages/surveys/components/Steps/StepFinal.tsx
import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export const StepFinal = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const values = getValues();

  const subcategoriesByCategory: Record<string, Subcategory[]> =
    values.subcategories || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Encuesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>ID:</strong> {values.id}
          </p>
          <p>
            <strong>Título:</strong> {values.title}
          </p>
          <p>
            <strong>Descripción:</strong> {values.description}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          {values.categories?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {values.categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No hay categorías.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subcategorías</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(subcategoriesByCategory).map(([catId, subs]) => {
            const cat = values.categories.find((c) => c.id === catId);
            return (
              <div key={catId} className="mb-4">
                <h4 className="font-medium mb-2">{cat?.name}</h4>
                {subs.length > 0 ? (
                  <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                    {subs.map((sub) => (
                      <li key={sub.id}>{sub.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sin subcategorías
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
