// export interface User {
//   id: string;
//   username: string;
//   role: string;
//   status: string;
//   accessToken: string;
//   refreshToken: string;
// }

export interface User {
  id: string;
  accessToken: string;
}

export interface CreateUserFormData {
  numberDoc: string;
  password: string;
  roleIds: string[];
}

export interface UserTableData {
  id: string;
  numberDoc: string;
  roles: { id: string; name: string }[];
}
