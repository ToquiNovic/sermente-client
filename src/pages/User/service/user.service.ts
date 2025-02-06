import axios from "axios";
import { CreateUserFormData } from "@/models";

// Interfaz para la respuesta de obtener usuarios
interface GetUsersResponse {
  users: {
    id: string;
    numberDoc: string;
    role: string;
  }[];
}

// Servicio para obtener usuarios
export const getUsers = async (): Promise<GetUsersResponse["users"]> => {
  try {
    const response = await axios.get<GetUsersResponse>("/api/user");
    return response.data.users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo específico para errores de Axios
      console.error("Error al obtener usuarios:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al obtener usuarios.");
    } else {
      // Manejo de otros tipos de errores
      console.error("Error desconocido al obtener usuarios:", error);
      throw new Error("Error desconocido al obtener usuarios.");
    }
  }
};

// Servicio para crear un usuario
export const createUser = async (userData: CreateUserFormData) => {
  const { numberDoc, password, roleId } = userData;

  // Validación del body
  if (!numberDoc || !password || !roleId) {
    console.error("Error: Faltan campos requeridos para crear el usuario.", { numberDoc, password, roleId });
    throw new Error("The fields 'numberDoc', 'password', and 'roleId' are required to create a user.");
  }

  // Validación opcional de roleId (si aplica)
  if (typeof roleId !== "number" || roleId <= 0) {
    console.error("Error: roleId inválido.", { roleId });
    throw new Error("The field 'roleId' must be a valid number greater than 0.");
  }

  // Log de datos enviados (para depuración)
  console.log("Enviando datos al backend para crear usuario:", { numberDoc, password, roleId });

  try {
    const response = await axios.post("/api/user", { numberDoc, password, roleId });

    // Log de la respuesta
    console.log("Usuario creado con éxito:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo específico para errores de Axios
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error al crear el usuario (Axios):", errorMessage);
      throw new Error(errorMessage);
    } else {
      // Manejo de otros tipos de errores
      console.error("Error desconocido al crear el usuario:", error);
      throw new Error("Unknown error occurred while creating user.");
    }
  }
};
