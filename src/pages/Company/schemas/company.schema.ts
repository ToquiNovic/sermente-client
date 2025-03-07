import * as z from "zod";

export const companySchema = z.object({
  nameCompany: z
    .string()
    .min(3, "El nombre de la empresa debe tener al menos 3 caracteres."),
  nitCompany: z.string().min(1, "El NIT no puede estar vacío."),
  legalAgent: z
    .string()
    .min(3, "El nombre del agente legal debe tener al menos 3 caracteres."),
  address: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres.")
    .optional(),
  phone: z
    .string()
    .min(3, "El teléfono debe tener al menos 3 caracteres.")
    .optional(),
  email: z
    .string()
    .min(3, "El email debe tener al menos 3 caracteres.")
    .optional(),
  numberOfEmployees: z
    .preprocess(
      (val) => Number(val),
      z.number().min(1, "El número de empleados debe ser mayor o igual a 1.")
    )
    .default(1),
});
