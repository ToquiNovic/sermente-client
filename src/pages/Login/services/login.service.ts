// src/pages/Login/services/login.service.ts
import axios, { AxiosError } from "axios";
import { LoginPayload, LoginPayloadType } from "../Schema";
import { z } from "zod";

export const loginUser = async (payload: LoginPayloadType) => {
  try {
    // Validar el payload con el esquema de zod antes de enviarlo
    LoginPayload.parse(payload);

    const response = await axios.post("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Devolver el primer mensaje de error de validación
      throw new Error(error.errors[0].message);
    }
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al iniciar sesión.");
    }
    throw new Error("Error inesperado al intentar iniciar sesión.");
  }
};