interface IBase {
  createdAt?: Date;
  updatedAt?: Date;
}
export enum FileValidationErrors {
  UNSUPPORTED_FILE_TYPE,
}
interface IBaseWithId extends IBase {
  id: string;
}
export interface IBaseWithMeta extends IBaseWithId {
  createdBy?: string;
  updatedBy?: string;
}
export interface IUser extends IBaseWithId {
  name: string;
  email: string;
  password: string;
  phone: number;
  status: boolean;
  refreshToken?: string;
  role: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface ISidebar extends IBaseWithId {
  name: string;
  icon: string;
  url: string;
  slug: string;
  status: boolean;
  displayOrder: number;
}

export interface IRole extends IBaseWithId {
  name: string;
  status: boolean;
}
export interface IAuth {
  email: string;
  password: string;
}
export interface IPermission {
  sidebar?: [];
}

export interface IAction extends IBaseWithId {
  name: string;
  status: boolean;
}
export interface IResetPassword {
  oldPassword: string;
  newPassword: string;
}
