import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { User, UserCreate, UserUpdate } from '../models/user.model';
import { Role, RoleCreate, RoleUpdate } from '../models/role.model';
import { Permission, PermissionCreate, PermissionUpdate } from '../models/permission.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true,
      date_joined: '2024-01-01T00:00:00Z',
      roles: [
        {
          id: 1,
          name: 'Admin',
          description: 'Full system access',
          permissions: []
        }
      ]
    },
    {
      id: 2,
      username: 'manager',
      email: 'manager@example.com',
      first_name: 'John',
      last_name: 'Manager',
      is_active: true,
      date_joined: '2024-01-15T00:00:00Z',
      roles: [
        {
          id: 2,
          name: 'Manager',
          description: 'Limited management access',
          permissions: []
        }
      ]
    },
    {
      id: 3,
      username: 'user',
      email: 'user@example.com',
      first_name: 'Jane',
      last_name: 'User',
      is_active: true,
      date_joined: '2024-02-01T00:00:00Z',
      roles: [
        {
          id: 3,
          name: 'User',
          description: 'Basic user access',
          permissions: []
        }
      ]
    }
  ];

  private roles: Role[] = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: [
        { id: 1, name: 'Can view users', codename: 'view_user', description: 'View user information' },
        { id: 2, name: 'Can add users', codename: 'add_user', description: 'Create new users' },
        { id: 3, name: 'Can change users', codename: 'change_user', description: 'Edit user information' },
        { id: 4, name: 'Can delete users', codename: 'delete_user', description: 'Delete users' }
      ]
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Limited management access',
      permissions: [
        { id: 1, name: 'Can view users', codename: 'view_user', description: 'View user information' },
        { id: 2, name: 'Can add users', codename: 'add_user', description: 'Create new users' }
      ]
    },
    {
      id: 3,
      name: 'User',
      description: 'Basic user access',
      permissions: []
    }
  ];

  private permissions: Permission[] = [
    {
      id: 1,
      name: 'Can view users',
      codename: 'view_user',
      description: 'View user information and profiles',
      api_endpoint: '/api/users/',
      http_method: 'GET'
    },
    {
      id: 2,
      name: 'Can add users',
      codename: 'add_user',
      description: 'Create new user accounts',
      api_endpoint: '/api/users/',
      http_method: 'POST'
    },
    {
      id: 3,
      name: 'Can change users',
      codename: 'change_user',
      description: 'Edit existing user information',
      api_endpoint: '/api/users/',
      http_method: 'PATCH'
    },
    {
      id: 4,
      name: 'Can delete users',
      codename: 'delete_user',
      description: 'Remove user accounts from the system',
      api_endpoint: '/api/users/',
      http_method: 'DELETE'
    },
    {
      id: 5,
      name: 'Can view roles',
      codename: 'view_role',
      description: 'View role information and assignments',
      api_endpoint: '/api/roles/',
      http_method: 'GET'
    },
    {
      id: 6,
      name: 'Can add roles',
      codename: 'add_role',
      description: 'Create new roles',
      api_endpoint: '/api/roles/',
      http_method: 'POST'
    },
    {
      id: 7,
      name: 'Can change roles',
      codename: 'change_role',
      description: 'Edit existing roles and permissions',
      api_endpoint: '/api/roles/',
      http_method: 'PATCH'
    },
    {
      id: 8,
      name: 'Can delete roles',
      codename: 'delete_role',
      description: 'Remove roles from the system',
      api_endpoint: '/api/roles/',
      http_method: 'DELETE'
    },
    {
      id: 9,
      name: 'Can view permissions',
      codename: 'view_permission',
      description: 'View permission definitions',
      api_endpoint: '/api/permissions/',
      http_method: 'GET'
    },
    {
      id: 10,
      name: 'Can add permissions',
      codename: 'add_permission',
      description: 'Create new permissions',
      api_endpoint: '/api/permissions/',
      http_method: 'POST'
    },
    {
      id: 11,
      name: 'Can change permissions',
      codename: 'change_permission',
      description: 'Edit existing permissions',
      api_endpoint: '/api/permissions/',
      http_method: 'PATCH'
    },
    {
      id: 12,
      name: 'Can delete permissions',
      codename: 'delete_permission',
      description: 'Remove permissions from the system',
      api_endpoint: '/api/permissions/',
      http_method: 'DELETE'
    }
  ];

  // User methods
  getUsers(params?: any): Observable<PaginatedResponse<User>> {
    let filteredUsers = [...this.users];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.first_name.toLowerCase().includes(search) ||
        user.last_name.toLowerCase().includes(search)
      );
    }

    if (params?.is_active !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.is_active === params.is_active);
    }

    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: PaginatedResponse<User> = {
      count: filteredUsers.length,
      next: endIndex < filteredUsers.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paginatedUsers
    };

    return of(response).pipe(delay(500));
  }

  getUser(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return of(user).pipe(delay(300));
  }

  createUser(userData: UserCreate): Observable<User> {
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      is_active: true,
      date_joined: new Date().toISOString(),
      roles: this.roles.filter(r => userData.roles?.includes(r.id))
    };
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(800));
  }

  updateUser(id: number, userData: UserUpdate): Observable<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...this.users[userIndex], ...userData };
    if (userData.roles) {
      updatedUser.roles = this.roles.filter(r => userData.roles?.includes(r.id));
    }
    
    this.users[userIndex] = updatedUser;
    return of(updatedUser).pipe(delay(600));
  }

  deleteUser(id: number): Observable<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users.splice(userIndex, 1);
    return of(void 0).pipe(delay(500));
  }

  activateUser(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.is_active = true;
    return of(user).pipe(delay(400));
  }

  deactivateUser(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.is_active = false;
    return of(user).pipe(delay(400));
  }

  // Role methods
  getRoles(params?: any): Observable<PaginatedResponse<Role>> {
    let filteredRoles = [...this.roles];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredRoles = filteredRoles.filter(role => 
        role.name.toLowerCase().includes(search) ||
        role.description.toLowerCase().includes(search)
      );
    }

    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

    const response: PaginatedResponse<Role> = {
      count: filteredRoles.length,
      next: endIndex < filteredRoles.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paginatedRoles
    };

    return of(response).pipe(delay(500));
  }

  getRole(id: number): Observable<Role> {
    const role = this.roles.find(r => r.id === id);
    if (!role) {
      throw new Error('Role not found');
    }
    return of(role).pipe(delay(300));
  }

  createRole(roleData: RoleCreate): Observable<Role> {
    const newRole: Role = {
      id: Math.max(...this.roles.map(r => r.id)) + 1,
      name: roleData.name,
      description: roleData.description,
      permissions: this.permissions.filter(p => roleData.permissions?.includes(p.id))
    };
    
    this.roles.push(newRole);
    return of(newRole).pipe(delay(800));
  }

  updateRole(id: number, roleData: RoleUpdate): Observable<Role> {
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }

    const updatedRole = { ...this.roles[roleIndex], ...roleData };
    if (roleData.permissions) {
      updatedRole.permissions = this.permissions.filter(p => roleData.permissions?.includes(p.id));
    }
    
    this.roles[roleIndex] = updatedRole;
    return of(updatedRole).pipe(delay(600));
  }

  deleteRole(id: number): Observable<void> {
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }
    
    this.roles.splice(roleIndex, 1);
    return of(void 0).pipe(delay(500));
  }

  assignPermissions(roleId: number, permissionIds: number[]): Observable<Role> {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    
    role.permissions = this.permissions.filter(p => permissionIds.includes(p.id));
    return of(role).pipe(delay(600));
  }

  removePermissions(roleId: number, permissionIds: number[]): Observable<Role> {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    
    role.permissions = role.permissions?.filter(p => !permissionIds.includes(p.id)) || [];
    return of(role).pipe(delay(600));
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    
    return of(role.permissions || []).pipe(delay(400));
  }

  // Permission methods
  getPermissions(params?: any): Observable<PaginatedResponse<Permission>> {
    let filteredPermissions = [...this.permissions];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredPermissions = filteredPermissions.filter(permission => 
        permission.name.toLowerCase().includes(search) ||
        permission.codename.toLowerCase().includes(search) ||
        permission.description.toLowerCase().includes(search)
      );
    }

    if (params?.http_method) {
      filteredPermissions = filteredPermissions.filter(permission => 
        permission.http_method === params.http_method
      );
    }

    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);

    const response: PaginatedResponse<Permission> = {
      count: filteredPermissions.length,
      next: endIndex < filteredPermissions.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paginatedPermissions
    };

    return of(response).pipe(delay(500));
  }

  getPermission(id: number): Observable<Permission> {
    const permission = this.permissions.find(p => p.id === id);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return of(permission).pipe(delay(300));
  }

  createPermission(permissionData: PermissionCreate): Observable<Permission> {
    const newPermission: Permission = {
      id: Math.max(...this.permissions.map(p => p.id)) + 1,
      name: permissionData.name,
      codename: permissionData.codename,
      description: permissionData.description,
      api_endpoint: permissionData.api_endpoint,
      http_method: permissionData.http_method
    };
    
    this.permissions.push(newPermission);
    return of(newPermission).pipe(delay(800));
  }

  updatePermission(id: number, permissionData: PermissionUpdate): Observable<Permission> {
    const permissionIndex = this.permissions.findIndex(p => p.id === id);
    if (permissionIndex === -1) {
      throw new Error('Permission not found');
    }

    const updatedPermission = { ...this.permissions[permissionIndex], ...permissionData };
    this.permissions[permissionIndex] = updatedPermission;
    return of(updatedPermission).pipe(delay(600));
  }

  deletePermission(id: number): Observable<void> {
    const permissionIndex = this.permissions.findIndex(p => p.id === id);
    if (permissionIndex === -1) {
      throw new Error('Permission not found');
    }
    
    this.permissions.splice(permissionIndex, 1);
    return of(void 0).pipe(delay(500));
  }

  getAvailableHttpMethods(): string[] {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  }
}