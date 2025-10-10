# Angular Authentication UI - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version
```

### 1. Install & Run
```bash
# Navigate to project directory
cd angular-auth-ui

# Install dependencies
npm install

# Start development server
npm start
```

**🎉 Your app is now running at `http://localhost:4200`**

## 📋 VS Code Setup (Recommended)

### 1. Install Required Extensions
Open VS Code → Extensions → Search and install:
- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 2. Open Project in VS Code
```bash
# Open VS Code in project directory
code .

# Or open VS Code and use File → Open Folder
```

### 3. Start Debugging
- Press `F5` in VS Code
- Or use the debug panel (Ctrl+Shift+D)
- Select "ng serve" configuration

## 🔧 Configuration

### Backend API Setup

Your Django backend should be running on `http://localhost:8000`. Update `proxy.conf.json` if different:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Environment Configuration

The app uses environment files for different configurations:

- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

## 🏗️ Architecture Overview

```
angular-auth-ui/
├── src/
│   ├── app/
│   │   ├── core/           # Core services, models, guards
│   │   ├── features/       # Feature modules (lazy loaded)
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── admin/      # Admin dashboard module
│   │   │   └── home/       # Home/unauthorized module
│   │   └── shared/         # Shared components
│   ├── assets/             # Static assets
│   └── styles.scss         # Global styles
├── .vscode/                # VS Code configuration
└── proxy.conf.json         # API proxy config
```

## 🎯 Key Features Implemented

### ✅ Authentication
- JWT token management
- Automatic token refresh
- Login/logout functionality
- Route protection

### ✅ User Management
- User listing with pagination
- User creation and editing
- Role assignment
- User activation/deactivation

### ✅ Role Management
- Role creation and editing
- Permission assignment
- Role-based UI visibility

### ✅ Permission Management
- Permission CRUD operations
- API endpoint mapping
- HTTP method-based permissions

### ✅ UI/UX
- Responsive design
- Loading states
- Error handling
- Modern, clean interface

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Build for production |
| `ng serve --proxy-config proxy.conf.json` | Start with API proxy |
| `ng test` | Run unit tests |
| `ng lint` | Run linter |

## 🔍 Troubleshooting

### Common Issues

1. **Port 4200 already in use**
   ```bash
   # Kill process using port 4200
   lsof -ti:4200 | xargs kill -9
   
   # Or use different port
   ng serve --port 4201
   ```

2. **CORS errors**
   - Ensure Django CORS is configured:
   ```python
   # In Django settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:4200",
   ]
   ```

3. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Angular CLI not found**
   ```bash
   # Install Angular CLI globally
   npm install -g @angular/cli
   ```

## 📱 Mobile Development

The app is fully responsive. Test mobile views:

```bash
# Start with host flag for mobile testing
ng serve --host 0.0.0.0 --port 4200

# Access from mobile device on same network
# http://<your-computer-ip>:4200
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
ng test --watch

# Run specific test file
ng test --include="**/auth.service.spec.ts"
```

### E2E Tests
```bash
# Install protractor (if not installed)
npm install -g protractor

# Run e2e tests
ng e2e
```

## 🚀 Production Build

```bash
# Build for production
npm run build

# Build with specific configuration
ng build --configuration=production

# Serve production build locally
npx http-server dist/angular-auth-ui
```

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token refresh before expiry
- Route guards for authentication
- Permission-based route access
- XSS protection through Angular
- CSRF protection (configurable)

## 📊 Performance Features

- Lazy loading modules
- Tree-shaking enabled
- Production optimizations
- AOT compilation
- Bundle size optimization

## 🎨 Customization

### Theme Colors
Update CSS variables in `src/styles.scss`:

```scss
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### Component Styling
Each component has its own SCSS file. Global styles are in `src/styles.scss`.

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Happy coding! 🎉**