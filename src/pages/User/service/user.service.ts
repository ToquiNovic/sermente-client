import axios from "axios";

interface GetUsersResponse {
  users: {
    id: string;
    numberDoc: string;
    roleId: number;
  }[];
}

export const getUsers = async (): Promise<GetUsersResponse["users"]> => {
  try {
    const response = await axios.get<GetUsersResponse>("/api/user");
    return response.data.users; // Devuelve el arreglo de usuarios
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};
