# Infrastructure Documentation

Infrastructure setup, deployment, and operational documentation for MADLAB.

## 📚 Infrastructure Guides

### Core Infrastructure
- [Infrastructure Overview](./README_INFRA.md) - Complete infrastructure documentation and setup

## 🏗️ Infrastructure Components

### Application Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Zustand with LocalStorage persistence
- **Styling**: Tailwind CSS
- **Build**: Vite bundler

### Deployment Platforms
- **Vercel**: Primary hosting platform
- **GitHub Pages**: Alternative static hosting
- **Docker**: Containerized deployment option

### Development Infrastructure
- **Node.js**: Runtime environment (18+)
- **npm**: Package management
- **Git**: Version control
- **GitHub Actions**: CI/CD automation

## 🚀 Deployment

### Quick Deploy
```bash
# Vercel deployment
npm run build
vercel deploy --prod

# Docker deployment
docker-compose up -d
```

### Environment Configuration
- Review [Infrastructure Overview](./README_INFRA.md) for environment variables
- Check [Deployment Guide](../deployment/README.md) for platform-specific instructions

## 🔧 Configuration

### Build Configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Docker Setup
- `docker-compose.yml` - Multi-service orchestration
- Container definitions for client and server

## 📊 Monitoring & Maintenance

Monitoring and maintenance documentation coming soon.

## 📖 Related Documentation

- [Deployment](../deployment/README.md) - Deployment strategies
- [Architecture](../architecture/README.md) - System architecture
- [Development](../development/README.md) - Development guides

---

*Part of the MADLAB Documentation Suite*
