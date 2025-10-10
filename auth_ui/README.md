# Angular Authentication UI

A comprehensive Angular frontend for Django JWT Authentication Service with role-based access control, user management, and permission management.

## Features

- 🔐 **JWT Authentication** with automatic token refresh
- 👥 **User Management** (CRUD operations)
- 🎭 **Role Management** with permission assignment
- 🔐 **Permission Management** for API endpoints
- 🛡️ **Route Guards** for authentication and permissions
- 📱 **Responsive Design** with modern UI
- 🔄 **Auto-refresh tokens** before expiry
- 🎯 **Role-based UI** visibility

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 17.x
- **VS Code** with recommended extensions

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to project directory
cd angular-auth-ui

# Install dependencies
npm install
```

### 2. Configure Environment

Create a proxy configuration file for development:

```bash
# Create proxy config for API
npx ng generate proxy-config
```

Or create `proxy.conf.json` manually:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### 3. Start Development Server

```bash
# Start the development server
npm start

# Or with Angular CLI
ng serve --proxy-config proxy.conf.json
```

The application will be available at `http://localhost:4200`

## VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best development experience:

1. **Angular Language Service** - Official Angular extension
2. **TypeScript Importer** - Automatically imports TypeScript modules
3. **ESLint** - JavaScript/TypeScript linting
4. **Prettier** - Code formatting
5. **Auto Rename Tag** - Auto rename paired HTML/XML tags
6. **Bracket Pair Colorizer** - Colorize matching brackets
7. **Material Icon Theme** - Beautiful file icons

### VS Code Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.html": "html"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### VS Code Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/src/*"
      }
    },
    {
      "name": "ng test",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:9876/debug.html",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Data models and interfaces
│   │   ├── services/         # Core services (auth, user, role, permission)
│   │   ├── guards/           # Route guards
│   │   └── interceptors/     # HTTP interceptors
│   ├── features/
│   │   ├── auth/             # Authentication module
│   │   ├── admin/            # Admin dashboard module
│   │   └── home/             # Home module
│   ├── shared/               # Shared components and utilities
│   └── app.module.ts
├── assets/                   # Static assets
└── styles.scss              # Global styles
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run lint` | Run linter |
| `ng serve` | Start dev server with Angular CLI |
| `ng build --prod` | Build production bundle |

## Configuration

### Backend API Configuration

The application expects the Django backend to be running at `http://localhost:8000`. Update the proxy configuration if your backend runs on a different port.

### Environment Files

Create environment files for different environments:

```bash
# Development environment
src/environments/environment.ts

# Production environment  
src/environments/environment.prod.ts
```

Example environment configuration:

```typescript
export const environment = {
  production: false,
  apiUrl: '/api',
  appName: 'Angular Auth UI'
};
```

## Development Workflow

### 1. Start Development Server

```bash
npm start
```

### 2. Open in Browser

Navigate to `http://localhost:4200` in your browser.

### 3. Login with Test Credentials

Use your Django backend credentials to login.

### 4. Enable Hot Reload

The development server supports hot reload - changes to files will automatically reload the browser.

### 5. Use VS Code Debugging

Press `F5` in VS Code to start debugging with Chrome.

## Common Issues and Solutions

### Issue: CORS Errors

**Solution**: Ensure your Django backend has CORS configured:

```python
# In Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```

### Issue: Token Refresh Not Working

**Solution**: Check that your Django JWT settings allow token refresh:

```python
# Django settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### Issue: Permission Errors

**Solution**: Ensure your Django user has the required permissions:

```bash
# Django shell
python manage.py shell
>>> from django.contrib.auth.models import Permission
>>> from django.contrib.contenttypes.models import ContentType
>>> # Add permissions to your user
```

## Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
ng test --watch
```

### End-to-End Tests

```bash
# Run e2e tests
ng e2e
```

## Building for Production

```bash
# Build production bundle
npm run build

# Build with specific configuration
ng build --configuration=production
```

The built files will be in the `dist/` directory.

## Deployment

### Static Hosting

For static hosting (Netlify, Vercel, GitHub Pages):

1. Build the application: `npm run build`
2. Deploy the `dist/` folder contents

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular-auth-ui /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## Acknowledgments

- Angular Team for the amazing framework
- Django REST Framework for the backend
- JWT for secure authentication