import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StepFinal = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const values = getValues();

  console.log("🔥 FACTORES", values.factors);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Encuesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>ID:</strong> {values.id}</p>
          <p><strong>Título:</strong> {values.title}</p>
          <p><strong>Descripción:</strong> {values.description}</p>
        </CardContent>
      </Card>

      {values.factors.map((factor) => (
        <Card key={factor.id}>
          <CardHeader>
            <CardTitle>{factor.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{factor.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {factor.domains?.length ? (
              factor.domains.map((domain) => (
                <div key={domain.id} className="border rounded p-4">
                  <h4 className="font-semibold">{domain.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{domain.description}</p>

                  {/* Aquí podrías mostrar dimensiones si las anidas luego */}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin dominios</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
