// @/pages/surveys/components/Steps/StepTwo.tsx
import { useEffect } from "react";

interface StepTwoProps {
  setTitle: (title: string) => void;
}

export const StepTwo = ({ setTitle }: StepTwoProps) => {
  useEffect(() => {
    setTitle("Paso 2: Configuración Avanzada");
  }, [setTitle]);

  return (
      <p>Aquí puedes agregar más configuraciones para la encuesta...</p>
  );
};
