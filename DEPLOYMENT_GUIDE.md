# Angular Authentication UI - Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name (optional)
- SSL certificate (optional)

#### Quick Deploy with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:4200
# Backend: http://localhost:8000 (if configured)
```

#### Production Docker Deployment
```bash
# Build production image
docker build -t angular-auth-ui:latest .

# Run container
docker run -d -p 80:80 --name angular-auth-ui angular-auth-ui:latest

# With environment variables
docker run -d -p 80:80 \
  -e API_URL=https://api.yourdomain.com \
  -e NODE_ENV=production \
  --name angular-auth-ui \
  angular-auth-ui:latest
```

### Option 2: Static Hosting

#### Build for Production
```bash
# Build the application
npm run build

# Files will be in dist/angular-auth-ui/
```

#### Deploy to Static Hosts

**Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist/angular-auth-ui
```

**Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod dist/angular-auth-ui
```

**AWS S3 + CloudFront**
```bash
# Upload to S3
aws s3 sync dist/angular-auth-ui s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

**GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npx gh-pages -d dist/angular-auth-ui
```

### Option 3: Server Deployment

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/angular-auth-ui;
    index index.html;

    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend_server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/angular-auth-ui
    
    # Handle Angular routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

## 🛠️ Environment Configuration

### Production Environment Variables
```bash
# API Configuration
export API_URL=https://api.yourdomain.com
export API_TIMEOUT=30000

# Application Configuration
export APP_NAME="Your App Name"
export APP_VERSION="1.0.0"
export NODE_ENV=production

# Security Configuration
export JWT_SECRET=your-jwt-secret
export CORS_ORIGIN=https://yourdomain.com
```

### Environment Files

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  appName: 'Angular Auth UI',
  demoMode: false
};
```

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt with Docker
```bash
# Install certbot
docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly --standalone \
  -d yourdomain.com -d www.yourdomain.com
```

### Nginx with SSL
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Your application configuration
    root /var/www/angular-auth-ui;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoring and Analytics

### Application Monitoring
```bash
# Install monitoring tools
npm install --save @sentry/angular

# Configure error tracking
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production'
});
```

### Performance Monitoring
```bash
# Install performance monitoring
npm install --save web-vitals

// In your main.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:ci
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to production
      run: |
        # Your deployment commands here
        echo "Deploying to production..."
```

### GitLab CI
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm run test:ci

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
```

## 🏗️ Infrastructure as Code

### Terraform Configuration
```hcl
resource "aws_s3_bucket" "angular_app" {
  bucket = "angular-auth-ui-${random_id.bucket_suffix.hex}"
}

resource "aws_cloudfront_distribution" "angular_app" {
  origin {
    domain_name = aws_s3_bucket.angular_app.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.angular_app.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.angular_app.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### Ansible Playbook
```yaml
---
- name: Deploy Angular Auth UI
  hosts: webservers
  become: yes
  
  tasks:
    - name: Install dependencies
      apt:
        name:
          - nginx
          - nodejs
          - npm
        state: present
        
    - name: Copy application files
      copy:
        src: dist/angular-auth-ui/
        dest: /var/www/angular-auth-ui/
        
    - name: Configure nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/angular-auth-ui
        
    - name: Enable site
      file:
        src: /etc/nginx/sites-available/angular-auth-ui
        dest: /etc/nginx/sites-enabled/angular-auth-ui
        state: link
        
    - name: Restart nginx
      service:
        name: nginx
        state: restarted
```

## 📈 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/angular-auth-ui/stats.json
```

### Code Splitting
```typescript
// Lazy load modules
const adminModule = () => import('./features/admin/admin.module').then(m => m.AdminModule);

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: adminModule,
    canLoad: [AuthGuard]
  }
];
```

### Preload Strategy
```typescript
import { PreloadAllModules } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## 🔍 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Memory Issues**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

**CORS Issues**
```bash
# Configure CORS in backend
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### Performance Issues
```bash
# Analyze performance
npm run build -- --source-map=false --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🔐 Security Best Practices

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self';
               connect-src 'self' https://api.yourdomain.com;
               frame-ancestors 'none';">
```

### Security Headers
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📞 Support and Maintenance

### Monitoring
- **Application Performance**: Monitor load times and errors
- **User Analytics**: Track user behavior and engagement
- **Security Monitoring**: Watch for security threats

### Updates
- **Dependency Updates**: Keep dependencies up to date
- **Security Patches**: Apply security patches promptly
- **Feature Updates**: Add new features based on user feedback

### Backup Strategy
- **Source Code**: Version control with Git
- **Configuration**: Backup configuration files
- **Data**: Regular database backups

---

**This deployment guide provides comprehensive instructions for deploying the Angular Authentication UI in production environments. Choose the deployment method that best fits your infrastructure and requirements.**