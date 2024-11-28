import axios from "axios";
import { Role } from "@/models";

interface GetRolesResponse {
  roles: Role[];
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await axios.get<GetRolesResponse>("/api/role");
    return response.data.roles;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};
