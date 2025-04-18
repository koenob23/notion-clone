# Deployment Guide

This guide covers deploying the Notion Clone API to various platforms.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Git

## Environment Variables

Ensure these environment variables are set in your deployment platform:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with these settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

## Railway Deployment

1. Create a new project in Railway
2. Connect your GitHub repository
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy with auto-detect settings

## Docker Deployment

1. Build the image:
```bash
docker build -t notion-clone .
```

2. Run with environment variables:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... \
  -e CLERK_SECRET_KEY=sk_test_... \
  notion-clone
```

## Database Migration

Run migrations before deploying:

```bash
npx prisma migrate deploy
```

## Health Checks

Monitor these endpoints:
- `/api/health` - API health
- `/api/pages` - Basic functionality

## Monitoring

1. Set up logging:
```bash
export LOG_LEVEL=info # or debug, warn, error
```

2. View logs:
- Vercel: Built-in logging
- Railway: Built-in logging
- Docker: `docker logs notion-clone`

## Performance Optimization

1. Enable caching:
```bash
export CACHE_TTL=3600 # 1 hour
```

2. Use connection pooling for database
3. Set up CDN for static assets

## Troubleshooting

Common issues:

1. Database connection:
   - Check DATABASE_URL format
   - Verify network access
   - Check SSL requirements

2. Authentication:
   - Verify Clerk keys
   - Check allowed domains in Clerk

3. Build failures:
   - Clear `.next` directory
   - Rebuild node_modules
   - Check Node.js version 