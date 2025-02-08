import axios from "axios";
import { CreateUserFormData } from "@/models";

// Interfaz para la respuesta de obtener usuarios
interface GetUsersResponse {
  users: {
    id: string;
    numberDoc: string;
    roles: { id: string; name: string }[];
  }[];
}

// Servicio para obtener usuarios
export const getUsers = async (): Promise<GetUsersResponse["users"]> => {
  try {
    const response = await axios.get<GetUsersResponse>("/api/user");
    return response.data.users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener usuarios:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al obtener usuarios.");
    } else {
      console.error("Error desconocido al obtener usuarios:", error);
      throw new Error("Error desconocido al obtener usuarios.");
    }
  }
};

// Servicio para crear un usuario
export const createUser = async (userData: CreateUserFormData) => {
  const { numberDoc, password, roleIds } = userData;

  if (!numberDoc || !password || !roleIds || !Array.isArray(roleIds)) {
    console.error("Error: Faltan campos requeridos o roleIds no es un array.", { numberDoc, password, roleIds });
    throw new Error("The fields 'numberDoc', 'password', and 'roleIds' (as an array) are required.");
  }
  try {
    const response = await axios.post("/api/user", { numberDoc, password, roleIds });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error al crear el usuario (Axios):", errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Error desconocido al crear el usuario:", error);
      throw new Error("Unknown error occurred while creating user.");
    }
  }
};

// Servicio para asignar un rol a un usuario
export const assignRoleToUser = async (userId: string, roleId: string) => {
  try {
    const response = await axios.put(`/api/user/${userId}/assign-role`, { roleId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { 
      throw new Error(error.response.data.message || "Error al asignar el rol.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

// Servicio para eliminar un rol de un usuario
export const removeRoleFromUser = async (userId: string, roleId: string) => {
  try {
    const response = await axios.post(`/api/user/${userId}/remove-role`,  { roleId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al eliminar el rol.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};
