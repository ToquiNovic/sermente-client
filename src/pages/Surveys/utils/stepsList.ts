// @/pages/surveys/utils/stepsList.ts
import { StepOne, StepTwo, StepThree } from "../Components/Steps";

export interface StepMeta {
  id: number;
  title: string;
  description: string;
  component: React.FC<StepProps>;
  buttons: ("back" | "next" | "submit")[];
}

export interface StepProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
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
    title: "Categorías2",
    component: StepTwo,
    description: "Agrega categorías a la encuesta.",
    buttons: ["back", "next"],
  },
  {
    id: 3,
    title: "Subcategorías3",
    component: StepThree,
    description:
      "Revisa la configuración de las subcategorías antes de finalizar.",
    buttons: ["back", "next"],
  },
  {
    id: 4,
    title: "Finalizar",
    component: StepThree,
    description:
      "Revisa la configuración de las subcategorías antes de finalizar.",
    buttons: ["back", "submit"],
  },
];
