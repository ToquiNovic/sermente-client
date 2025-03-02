// src/pages/Login/Schema.ts
import * as z from "zod";

// Define the form schema
export const formSchema = (isSpecialist: boolean) =>
  z.object({
    idNumber: z
      .string()
      .min(6, { message: "El número de identificación debe tener al menos 6 caracteres" })
      .max(15, { message: "El número de identificación no debe superar los 15 caracteres" }),
    password: isSpecialist
      ? z.string().min(6, { message: "La contraseña debe tener al menos 8 caracteres" })
      : z.string().optional(),
  });

export type FormData = z.infer<ReturnType<typeof formSchema>>;

export const LoginPayload = z.object({
  numberDoc: z.string().min(6, { message: "El número de identificación debe tener al menos 6 caracteres" }),
  password: z.string().min(2, { message: "La contraseña debe tener al menos 8 caracteres" }).optional(),
});

export type LoginPayloadType = z.infer<typeof LoginPayload>;
