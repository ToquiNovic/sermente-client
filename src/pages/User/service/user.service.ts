import axios from "axios";
import { CreateUserFormData } from "@/models";

// Interfaz para la respuesta de obtener usuarios
interface GetUsersResponse {
  users: {
    state: string;
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

  if (!numberDoc || !roleIds || !Array.isArray(roleIds)) {
    console.error("Error: Faltan campos requeridos o roleIds no es un array.", { numberDoc, password, roleIds });
    throw new Error("El número de documento y el rol son obligatorios.");
  }

  const isEncuestado = roleIds.includes("3");

  if (!isEncuestado && !password) {
    console.error("Error: La contraseña es obligatoria para este rol.");
    throw new Error("La contraseña es obligatoria excepto para encuestados.");
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

// Servicio para eliminar un usuario
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al eliminar el usuario.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

// servicio para obtener el detalle de un usuario
export const getUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al obtener el detalle del usuario.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

// servicio para actualizar el estado de un usuario
export const updateUserState = async (userId: string, state: string) => {
  try {
    const response = await axios.put(`/api/user/${userId}/state`, { state });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al actualizar el estado del usuario.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};