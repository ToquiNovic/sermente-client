export interface Role {
  id: string;
  name: string;
  state: boolean;
  description: string;
}

export interface RolePayload {
  id: string;
  name: string;
  state: boolean;
  description: string;
}

export interface CreateRoleFromData {
  name: string;
  state: boolean;
  description: string;
}

export interface RoleTableData {
  id: string;
  name: string;
  state: boolean;
  description?: string;
}