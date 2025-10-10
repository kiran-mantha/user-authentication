# Angular Authentication UI Architecture

## Backend API Structure Analysis
Based on the Django DRF JWT backend, the API endpoints are:
- `/api/login/` - Authentication & token generation
- `/api/logout/` - Token blacklisting
- `/api/user/` - User profile fetch
- CRUD endpoints for users, roles, permissions
- Custom permission resolver (HTTP method + API name → roles)

## Angular Module Architecture

```
src/
├── app/
│   ├── core/                 # Core singleton services
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── role.service.ts
│   │   │   └── permission.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── permission.guard.ts
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── role.model.ts
│   │       └── permission.model.ts
│   ├── shared/               # Shared components, directives, pipes
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   └── error-message/
│   │   └── utils/
│   │       └── api-response.util.ts
│   ├── features/
│   │   ├── auth/             # Authentication feature module (lazy loaded)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth-routing.module.ts
│   │   │   ├── pages/
│   │   │   │   └── login/
│   │   │   └── components/
│   │   │       └── login-form/
│   │   ├── admin/            # Admin feature module (lazy loaded)
│   │   │   ├── admin.module.ts
│   │   │   ├── admin-routing.module.ts
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   └── permissions/
│   │   │   └── components/
│   │   │       ├── sidebar/
│   │   │       └── user-table/
│   │   └── home/             # Home feature module
│   │       ├── home.module.ts
│   │       └── pages/
│   │           └── home/
│   └── app.module.ts
│   └── app-routing.module.ts
```

## State Management Strategy
- **Authentication State**: BehaviorSubject in AuthService
- **User/Role Data**: Component-level state with shared services
- **Route State**: Router state for navigation
- **Form State**: Reactive forms with validation

## Security Features
1. **JWT Token Management**: Automatic token refresh before expiry
2. **Route Guards**: Authentication and permission-based access control
3. **HTTP Interceptors**: Automatic token attachment to requests
4. **Role-Based UI**: Dynamic menu and feature visibility

## UI/UX Design
- **Layout**: Admin dashboard with sidebar navigation
- **Theme**: Modern, clean design with loading states
- **Responsive**: Mobile-first responsive design
- **Feedback**: Toast notifications for user actions