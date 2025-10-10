# Angular Authentication UI - API Documentation

## 🚀 Services Overview

This document describes the Angular services that interact with your Django JWT Authentication backend.

## 📋 Service Methods

### AuthService

**Purpose**: Handles authentication, token management, and user session state.

#### Methods

```typescript
// Login user and store tokens
login(credentials: LoginRequest): Observable<LoginResponse>

// Logout user and clear tokens
logout(): Observable<any>

// Refresh access token using refresh token
refreshAccessToken(): Observable<string>

// Get current user profile
getCurrentUser(): Observable<AuthUser>

// Validate current token and get user
validateTokenAndGetUser(): Observable<AuthUser>

// Check if user is authenticated
isAuthenticated(): boolean

// Get current user data
getCurrentUserData(): any

// Get access token
getAccessToken(): string | null

// Check if user has specific role
hasRole(roleName: string): boolean

// Check if user has specific permission
hasPermission(permissionCodename: string): boolean
```

#### Usage Example
```typescript
constructor(private authService: AuthService) {}

login() {
  this.authService.login({ username, password })
    .subscribe({
      next: (response) => {
        // Login successful, redirect to dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        // Handle login error
        this.errorMessage = 'Invalid credentials';
      }
    });
}
```

---

### UserService

**Purpose**: Manages user CRUD operations.

#### Methods

```typescript
// Get paginated list of users
getUsers(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
}): Observable<PaginatedResponse<User>>

// Get single user by ID
getUser(id: number): Observable<User>

// Create new user
createUser(user: UserCreate): Observable<User>

// Update existing user
updateUser(id: number, user: UserUpdate): Observable<User>

// Delete user
deleteUser(id: number): Observable<void>

// Activate user
activateUser(id: number): Observable<User>

// Deactivate user
deactivateUser(id: number): Observable<User>
```

#### Usage Example
```typescript
constructor(private userService: UserService) {}

loadUsers() {
  this.userService.getUsers({ 
    page: 1, 
    page_size: 10, 
    search: 'john' 
  }).subscribe({
    next: (response) => {
      this.users = response.results;
      this.totalUsers = response.count;
    }
  });
}

createNewUser() {
  const newUser: UserCreate = {
    username: 'newuser',
    email: 'new@example.com',
    first_name: 'New',
    last_name: 'User',
    password: 'securepassword',
    roles: [1, 2] // Role IDs
  };
  
  this.userService.createUser(newUser).subscribe({
    next: (user) => {
      console.log('User created:', user);
    }
  });
}
```

---

### RoleService

**Purpose**: Manages role operations and permission assignments.

#### Methods

```typescript
// Get paginated list of roles
getRoles(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}): Observable<PaginatedResponse<Role>>

// Get single role by ID
getRole(id: number): Observable<Role>

// Create new role
createRole(role: RoleCreate): Observable<Role>

// Update existing role
updateRole(id: number, role: RoleUpdate): Observable<Role>

// Delete role
deleteRole(id: number): Observable<void>

// Assign permissions to role
assignPermissions(roleId: number, permissionIds: number[]): Observable<Role>

// Remove permissions from role
removePermissions(roleId: number, permissionIds: number[]): Observable<Role>

// Get role permissions
getRolePermissions(roleId: number): Observable<Permission[]>
```

#### Usage Example
```typescript
constructor(private roleService: RoleService) {}

createRoleWithPermissions() {
  const newRole: RoleCreate = {
    name: 'Manager',
    description: 'Manager role with limited permissions',
    permissions: [1, 2, 3, 4, 5] // Permission IDs
  };
  
  this.roleService.createRole(newRole).subscribe({
    next: (role) => {
      console.log('Role created:', role);
    }
  });
}

assignPermissionsToRole(roleId: number) {
  const permissionIds = [6, 7, 8];
  
  this.roleService.assignPermissions(roleId, permissionIds)
    .subscribe({
      next: (role) => {
        console.log('Permissions assigned:', role);
      }
    });
}
```

---

### PermissionService

**Purpose**: Manages permission CRUD operations.

#### Methods

```typescript
// Get paginated list of permissions
getPermissions(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  api_endpoint?: string;
  http_method?: string;
}): Observable<PaginatedResponse<Permission>>

// Get single permission by ID
getPermission(id: number): Observable<Permission>

// Create new permission
createPermission(permission: PermissionCreate): Observable<Permission>

// Update existing permission
updatePermission(id: number, permission: PermissionUpdate): Observable<Permission>

// Delete permission
deletePermission(id: number): Observable<void>

// Get available HTTP methods
getAvailableHttpMethods(): string[]
```

#### Usage Example
```typescript
constructor(private permissionService: PermissionService) {}

createApiPermission() {
  const newPermission: PermissionCreate = {
    name: 'Can View Reports',
    codename: 'view_reports',
    description: 'Permission to view system reports',
    api_endpoint: '/api/reports/',
    http_method: 'GET'
  };
  
  this.permissionService.createPermission(newPermission)
    .subscribe({
      next: (permission) => {
        console.log('Permission created:', permission);
      }
    });
}

searchPermissions() {
  this.permissionService.getPermissions({
    search: 'user',
    http_method: 'POST'
  }).subscribe({
    next: (response) => {
      this.permissions = response.results;
    }
  });
}
```

---

## 🛡️ Guards

### AuthGuard

**Purpose**: Protects routes that require authentication.

```typescript
// Usage in routing module
{
  path: 'admin',
  canActivate: [AuthGuard],
  loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
}
```

### PermissionGuard

**Purpose**: Protects routes that require specific permissions or roles.

```typescript
// Usage in routing module
{
  path: 'users',
  component: UserListComponent,
  canActivate: [PermissionGuard],
  data: { permission: 'view_user' }
}

{
  path: 'roles',
  component: RoleListComponent,
  canActivate: [PermissionGuard],
  data: { role: 'Admin' }
}
```

---

## 🔧 Interceptors

### JwtInterceptor

**Purpose**: Automatically attaches JWT tokens to API requests and handles token refresh.

**Features**:
- Attaches Authorization header to requests
- Automatically refreshes expired tokens
- Handles 401 errors gracefully
- Queues requests during token refresh

**Configuration**:
```typescript
// In app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
]
```

---

## 📋 Models

### User Models

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  roles?: Role[];
}

interface UserCreate {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  roles?: number[];
}

interface UserUpdate {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  roles?: number[];
}
```

### Role Models

```typescript
interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

interface RoleCreate {
  name: string;
  description: string;
  permissions?: number[];
}

interface RoleUpdate {
  name?: string;
  description?: string;
  permissions?: number[];
}
```

### Permission Models

```typescript
interface Permission {
  id: number;
  name: string;
  codename: string;
  description: string;
  api_endpoint?: string;
  http_method?: string;
}

interface PermissionCreate {
  name: string;
  codename: string;
  description: string;
  api_endpoint?: string;
  http_method?: string;
}

interface PermissionUpdate {
  name?: string;
  codename?: string;
  description?: string;
  api_endpoint?: string;
  http_method?: string;
}
```

### Auth Models

```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface RefreshTokenRequest {
  refresh: string;
}

interface RefreshTokenResponse {
  access: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}
```

### Common Models

```typescript
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

interface FilterOptions {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}
```

---

## 🚨 Error Handling

### Service Error Handling

All services include comprehensive error handling:

```typescript
this.userService.getUsers().subscribe({
  next: (response) => {
    // Handle success
    this.users = response.results;
  },
  error: (error) => {
    // Handle error
    console.error('Error loading users:', error);
    this.errorMessage = 'Failed to load users';
  }
});
```

### Common Error Types

- **401 Unauthorized**: Authentication required or token expired
- **403 Forbidden**: User lacks required permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## 🔍 Testing Services

### Unit Testing Example

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    const mockResponse: LoginResponse = {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: { id: 1, username: 'testuser', email: 'test@example.com', first_name: 'Test', last_name: 'User' }
    };

    service.login({ username: 'testuser', password: 'password' })
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne('/api/login/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

---

## 📚 Best Practices

### Service Usage

1. **Always unsubscribe** from observables in components
2. **Handle errors** appropriately in subscriptions
3. **Use async pipe** when possible for automatic unsubscribing
4. **Cache data** when appropriate to reduce API calls
5. **Use loading states** for better UX

### Security

1. **Never store sensitive data** in component properties
2. **Use environment files** for configuration
3. **Validate data** on both client and server
4. **Use HTTPS** in production
5. **Implement proper CORS** configuration

---

## 🔄 API Endpoints Mapping

| Service Method | Django API Endpoint | HTTP Method |
|----------------|-------------------|-------------|
| `authService.login()` | `/api/login/` | POST |
| `authService.logout()` | `/api/logout/` | POST |
| `authService.getCurrentUser()` | `/api/user/` | GET |
| `userService.getUsers()` | `/api/users/` | GET |
| `userService.getUser(id)` | `/api/users/{id}/` | GET |
| `userService.createUser()` | `/api/users/` | POST |
| `userService.updateUser()` | `/api/users/{id}/` | PATCH |
| `userService.deleteUser()` | `/api/users/{id}/` | DELETE |
| `userService.activateUser()` | `/api/users/{id}/activate/` | PATCH |
| `userService.deactivateUser()` | `/api/users/{id}/deactivate/` | PATCH |
| `roleService.getRoles()` | `/api/roles/` | GET |
| `roleService.getRole(id)` | `/api/roles/{id}/` | GET |
| `roleService.createRole()` | `/api/roles/` | POST |
| `roleService.updateRole()` | `/api/roles/{id}/` | PATCH |
| `roleService.deleteRole()` | `/api/roles/{id}/` | DELETE |
| `roleService.assignPermissions()` | `/api/roles/{id}/assign_permissions/` | POST |
| `roleService.removePermissions()` | `/api/roles/{id}/remove_permissions/` | POST |
| `roleService.getRolePermissions()` | `/api/roles/{id}/permissions/` | GET |
| `permissionService.getPermissions()` | `/api/permissions/` | GET |
| `permissionService.getPermission(id)` | `/api/permissions/{id}/` | GET |
| `permissionService.createPermission()` | `/api/permissions/` | POST |
| `permissionService.updatePermission()` | `/api/permissions/{id}/` | PATCH |
| `permissionService.deletePermission()` | `/api/permissions/{id}/` | DELETE |

---

This API documentation provides a comprehensive guide to using the Angular services in your authentication UI application.