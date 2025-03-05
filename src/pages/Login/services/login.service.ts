import axios, { AxiosError } from "axios";
import { LoginPayloadType } from "../Schema";

export const loginUser = async (payload: LoginPayloadType) => {
  try {
    const response = await axios.post("/api/auth/login", payload);
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al iniciar sesión.");
    }
    throw new Error("Error inesperado al intentar iniciar sesión.");
  }
};
