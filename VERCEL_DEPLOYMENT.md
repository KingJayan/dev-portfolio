# Vercel Deployment Guide

This guide will help you deploy your portfolio website to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a GitHub, GitLab, or Bitbucket repository
3. **Environment Variables**: You'll need to set up your environment variables in Vercel

## Step 1: Prepare Your Repository

1. Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
2. The `vercel.json` and `.vercelignore` files have been added to your project

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository by connecting your Git provider
4. Select your portfolio repository

## Step 3: Configure Build Settings

Vercel should automatically detect your settings, but verify:

- **Framework Preset**: Other (or leave as detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

## Step 4: Set Environment Variables

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

### Required Variables
- `DATABASE_URL`: Your PostgreSQL database connection string
- `NODE_ENV`: Set to `production`

### Optional Variables (if using email features)
- `MAILJET_API_KEY`: Your Mailjet API key
- `MAILJET_SECRET_KEY`: Your Mailjet secret key

### Database Setup Options

#### Option 1: Vercel Postgres (Recommended)
1. In your Vercel dashboard, go to the Storage tab
2. Create a new Postgres database
3. Copy the connection string to your `DATABASE_URL` environment variable

#### Option 2: External Database
- Use services like:
  - **Neon**: Free PostgreSQL hosting
  - **Supabase**: Free PostgreSQL with additional features
  - **Railway**: Simple database hosting
  - **PlanetScale**: MySQL alternative

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your site will be available at `https://your-project-name.vercel.app`

## Step 6: Set Up Database Schema

After deployment, you'll need to set up your database tables:

1. In your Vercel dashboard, go to Functions → View Function Logs
2. Or use the Vercel CLI: `vercel logs`
3. Run database migrations if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compiles without errors

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is set correctly
   - Check database server is accessible from Vercel
   - Ensure database schema is created

3. **API Routes Not Working**
   - Verify `vercel.json` routing configuration
   - Check function logs for errors
   - Ensure API routes are in correct directory structure

### Performance Optimization

1. **Enable Caching**
   - Static assets are automatically cached by Vercel
   - Use appropriate cache headers for API responses

2. **Optimize Images**
   - Use Vercel's Image Optimization
   - Compress images before upload

3. **Bundle Size**
   - Use `npm run build` to check bundle size
   - Remove unused dependencies

## Custom Domain

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate to be issued

## Environment-Specific Notes

### Development vs Production

- Development uses in-memory storage
- Production requires a real database
- Make sure to test with production-like data

### Security

- Never commit sensitive environment variables
- Use Vercel's environment variable encryption
- Regularly rotate API keys and secrets

## Monitoring

- Use Vercel Analytics for traffic insights
- Set up error tracking with services like Sentry
- Monitor function execution times in Vercel dashboard

## Continuous Deployment

- Vercel automatically deploys when you push to your main branch
- Set up preview deployments for pull requests
- Use branch protection rules in your Git repository

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review function logs in Vercel dashboard
3. Test locally with `npm run build` and `npm run start`