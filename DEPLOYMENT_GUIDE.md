# 🚀 Complete Vercel Deployment Guide

## 📋 Prerequisites

- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ OpenAI API key
- ✅ Claude API key (optional)

## 🛠️ Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Add all files to git
git add .

# Commit your changes
git commit -m "Ready for Vercel deployment with secure API configuration"

# Push to your repository
git push origin main
```

### 2. Deploy to Vercel

#### Option A: One-Click Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import your Git repository**
4. Vercel will auto-detect this as a Vite project

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

#### 🔒 Secure Production Setup (Recommended)
```
OPENAI_API_KEY = sk-proj-your-openai-key-here
CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

#### 🔧 Development Setup (Client-Side)
```
VITE_OPENAI_API_KEY = sk-proj-your-openai-key-here
VITE_CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

### 4. Deploy

1. Click **"Deploy"** in Vercel dashboard
2. Wait for build to complete
3. Get your live URL (e.g., `https://your-app.vercel.app`)

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (auto-detected)

## 🛡️ Security Features

### Production Setup (Secure)
- ✅ **Server-side API keys** - Keys never exposed to browser
- ✅ **Vercel serverless functions** as secure proxy
- ✅ **Automatic fallback** to direct API calls if needed
- ✅ **CORS handling** for cross-origin requests
- ✅ **Rate limiting** through Vercel
- ✅ **Error handling** and logging

### API Endpoints
- `/api/transcribe` - Secure transcription endpoint
- `/api/summarize` - Secure summarization endpoint

## 📊 Monitoring & Analytics

### Vercel Dashboard
- **Function Logs**: Monitor API calls and errors
- **Analytics**: Performance metrics
- **Deployments**: Build history and status

### API Usage Monitoring
- **OpenAI Dashboard**: Track usage and costs
- **Claude Dashboard**: Monitor API calls
- **Vercel Functions**: Serverless function metrics

## 🔄 Updates & Maintenance

### Automatic Updates
- Push changes to your repository
- Vercel automatically redeploys
- Preview deployments for pull requests

### Manual Updates
```bash
# Pull latest changes
git pull origin main

# Push updates
git push origin main

# Vercel auto-deploys
```

## 🚨 Troubleshooting

### Build Failures
1. **Check dependencies**: Ensure all packages are in `package.json`
2. **Environment variables**: Verify API keys are set correctly
3. **Build logs**: Check Vercel dashboard for error details

### API Issues
1. **Test API keys**: Use the debug script locally
2. **Check quotas**: Verify OpenAI/Claude account status
3. **Monitor usage**: Track API calls in dashboards

### Common Issues
- **CORS errors**: Handled automatically by Vercel
- **Timeout errors**: API functions have 30s timeout
- **Memory issues**: Vercel provides 1GB memory per function

## 📈 Performance Optimization

### Built-in Optimizations
- **Code splitting**: Automatic vendor library separation
- **Minification**: Production builds are minified
- **Static assets**: Optimized for CDN delivery
- **Caching**: Automatic static asset caching

### Custom Optimizations
- **Bundle analysis**: Use `npm run build -- --analyze`
- **Image optimization**: Vercel handles automatically
- **CDN**: Global edge network for fast delivery

## 🌐 Custom Domain Setup

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## 📞 Support & Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### API Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Claude API Docs](https://docs.anthropic.com/)

### Community
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vite Community](https://github.com/vitejs/vite/discussions)

## ✅ Deployment Checklist

- [ ] Repository pushed to Git
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] API endpoints working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## 🎉 Success!

Your Meeting Transcription App is now live and ready to use!

**Next Steps:**
1. Test your deployed app
2. Monitor API usage
3. Set up custom domain (optional)
4. Configure monitoring and alerts

---

**Need Help?** Check the troubleshooting section or refer to the documentation links above.
