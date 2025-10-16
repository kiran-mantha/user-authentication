import { Permission } from './permission.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface RoleCreate {
  name: string;
  description: string;
  permissions?: number[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permissions?: number[];
}