import { useFormContext } from "react-hook-form";
import { SurveyFormData, DomainforFactor, DimensionforDomain } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StepFour = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const { factors } = getValues();

  return (
    <div className="space-y-6">
      {factors.map((factor) => (
        <Card key={factor.id}>
          <CardHeader>
            <CardTitle>{factor.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{factor.description}</p>
          </CardHeader>
          <CardContent>
            {factor.domains?.map((domain: DomainforFactor & { dimensions?: DimensionforDomain[] }) => (
              <div key={domain.id} className="mb-4">
                <h4 className="font-semibold text-sm">{domain.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{domain.description}</p>
                <ul className="list-disc ml-6 text-sm text-muted-foreground">
                  {domain.dimensions?.map((dim) => (
                    <li key={dim.id}>{dim.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
