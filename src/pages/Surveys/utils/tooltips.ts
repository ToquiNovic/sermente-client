interface TooltipContent {
  factor: string;
  domain: string;
  dimension: string;
  relatedQuestion: string;
  position: string;
  question: string;
  multipleChoice: string;
  options: string;
}

export const tooltips: TooltipContent = {
  factor: "Selecciona el factor que se utilizará para la encuesta.",
  domain: "Selecciona un Dominio para asociar las preguntas.",
  dimension:
    "Selecciona una dimensión dentro del dominio para asociar las preguntas.",
  relatedQuestion: "Selecciona la pregunta para editarla, si aplica.",
  position:
    "Define el orden en que aparecerá la pregunta dentro de la subcategoría.",
  question: "Escribe el texto de la pregunta que se presentará en la encuesta.",
  multipleChoice:
    "Activa esta opción si la pregunta tendrá opciones de selección múltiple.",
  options: "Lista de opciones para la pregunta.",
};
