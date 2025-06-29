// @/pages/surveys/utils/stepsList.ts
import { StepOne, StepTwo, StepThree, StepFinal, StepFour } from "../Components/Steps";
import { Dispatch, SetStateAction } from "react";

export interface StepMeta {
  id: number;
  title: string;
  description: string;
  component: React.FC<StepProps>;
  buttons: ("back" | "next" | "submit")[];
}

export interface StepProps {
  setTitle: Dispatch<SetStateAction<string>>;
  setIsStepValid: Dispatch<SetStateAction<boolean>>;
  onNext: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

export const stepsList: StepMeta[] = [
  {
    id: 1,
    title: "Información Básica",
    component: StepOne,
    description: "Ingresa la información principal de la encuesta.",
    buttons: ["next"],
  },
  {
    id: 2,
    title: "Factores",
    component: StepTwo,
    description: "Agrega factores a la encuesta.",
    buttons: ["back", "next"],
  },
  {
    id: 3,
    title: "Dominios",
    component: StepThree,
    description:
      "Revisa la configuración de los dominios para cada factor.",
    buttons: ["back", "next"],
  },
  {
    id: 4,
    title: "Dimensiones",
    component: StepFour,
    description:
      "Revisa la configuración de las dimensiones para cada dominio.",
    buttons: ["back", "next"],
  },
  {
    id: 5,
    title: "Finalizar",
    component: StepFinal,
    description:
      "Revisa la configuración de las subcategorías antes de finalizar.",
    buttons: ["back", "submit"],
  },
];
