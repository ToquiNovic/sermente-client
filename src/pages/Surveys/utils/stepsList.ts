// @/pages/surveys/utils/stepsList.ts
import { StepOne, StepTwo, StepThree } from "../Components/Steps";

export const stepsList = [
  {
    id: 1,
    title: "Información Básica",
    component: StepOne,
    description: "Ingresa la información principal de la encuesta.",
  },
  {
    id: 2,
    title: "Categorias2",
    component: StepTwo,
    description: "Agrega Categorias a la encuesta.",
  },
  {
    id: 3,
    title: "Subcategorías",
    component: StepThree,
    description: "Revisa la configuración de la Subcategorías antes de finalizar.",
  },
  {
    id: 4,
    title: "Finalizar",
    component: StepThree,
    description: "Revisa la configuración de la Subcategorías antes de finalizar.",
  },
];
