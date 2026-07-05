/**
 * Modelo de dominio: Usuario
 */

export interface User {
  id?: number;
  email: string;
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  PHARMACIST = 'pharmacist',
}

export interface UserCreate {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}
