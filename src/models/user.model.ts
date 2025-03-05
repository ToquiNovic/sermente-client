// @/models/user.model.ts
export interface User {
  id: string;
  accessToken: string;
  userPerfil: UserPerfil | null;
}

export interface CreateUserFormData {
  numberDoc: string;
  password: string;
  roleNames?: string[]; 
  roleIds: string[];  
}

export enum UserState {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export interface UserTableData {
  id: string;
  numberDoc: string;
  roles: { id: string; name: string }[];
  state: UserState;
}

export interface PeoplePerfil {
  names: string;
  surNames: string;
}

export interface RolePerfil {
  id: string;
  name: string;
}

export interface UserPerfil {
  id: string;
  numberDoc: string;
  roles: RolePerfil[];
  state: UserState;
  people: PeoplePerfil;
}