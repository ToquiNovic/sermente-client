import * as z from "zod";

// Define the form schema
export const formSchema = z.object({
  idNumber: z
    .string()
    .min(6, {
      message: "El número de identificación debe tener al menos 6 caracteres",
    })
    .max(15, {
      message: "El número de identificación no debe superar los 15 caracteres",
    }),
  password: z
    .string()
    .min(2, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type FormData = z.infer<typeof formSchema>;

export const LoginPayload = z.object({
  numberDoc: z.string().min(6, { message: "El número de identificación debe tener al menos 6 caracteres" }),
  password: z.string().min(2, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type LoginPayloadType = z.infer<typeof LoginPayload>;
