import { SetMetadata } from '@nestjs/common';

//  The key we will use to read metadata with Guard
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify the roles allowed to access a route
 *
 * Usage:
 *   @Roles('admin')           → admin
 *   @Roles('admin', 'user')   → admin or user
 */
export const Roles = (...roles: Array<'admin' | 'user'>) =>
  SetMetadata(ROLES_KEY, roles);
