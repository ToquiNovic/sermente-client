import axios from "axios";
import { Role, CreateRoleFromData } from "@/models";

// Interfaz para la respuesta de obtener roles
interface GetRolesResponse {
  roles: Role[];
}

// Servicio para obtener todos los roles
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await axios.get<GetRolesResponse>("/api/role");
    return response.data.roles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener roles:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al obtener roles.");
    } else {
      console.error("Error desconocido al obtener roles:", error);
      throw new Error("Error desconocido al obtener roles.");
    }
  }
};

// Interfaz para la respuesta de crear un rol
interface CreateRoleResponse {
  message: string; 
  role: Role;
}

// Servicio para crear un rol
export const createRole = async (roleData: CreateRoleFromData): Promise<Role> => {
  try {
    const response = await axios.post<CreateRoleResponse>("/api/role", roleData);
    return response.data.role;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al crear el rol.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

export const updateRoleState = async (id: string, newState: boolean) => {
  try {
    const response = await axios.patch(`/api/role/${id}`, { state: newState });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al actualizar el estado.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/role/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al eliminar el rol.");
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

