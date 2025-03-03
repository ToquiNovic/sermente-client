// export interface User {
//   id: string;
//   username: string;
//   role: string;
//   status: string;
//   accessToken: string;
//   refreshToken: string;
// }
// model/user.model.ts
export interface User {
  id: string;
  accessToken: string;
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