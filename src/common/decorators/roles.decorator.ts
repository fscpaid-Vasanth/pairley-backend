import { SetMetadata } from '@nestjs/common';

export enum Role {
  CUSTOMER = 'Customer',
  BUSINESS = 'Business',
  ADMIN = 'Admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
