# Quick Vercel Deployment Guide

## 🚀 One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/meeting-transcription)

## 📋 Manual Deployment Steps

### 1. Push to Git
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Configure environment variables (see below)
5. Click "Deploy"

### 3. Environment Variables Setup

**For Secure Production (Recommended):**
```
OPENAI_API_KEY = sk-your-openai-key-here
CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

**For Development/Testing:**
```
VITE_OPENAI_API_KEY = sk-your-openai-key-here
VITE_CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

## 🔧 Configuration Files Created

- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `api/transcribe.js` - Secure transcription endpoint
- ✅ `api/summarize.js` - Secure summarization endpoint
- ✅ `src/utils/secureApiIntegration.js` - Secure API utilities
- ✅ Optimized `vite.config.js` for production

## 🛡️ Security Features

- **Server-side API keys** (production)
- **Automatic fallback** to direct API calls
- **CORS handling** for cross-origin requests
- **Error handling** and logging
- **Rate limiting** through Vercel

## 📊 Monitoring

After deployment, monitor:
- API usage in OpenAI/Claude dashboards
- Vercel function logs
- Performance metrics
- Error rates

## 🔄 Updates

To update your deployment:
1. Push changes to your repository
2. Vercel automatically redeploys
3. Preview deployments for pull requests

## 📞 Support

- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Claude API Documentation](https://docs.anthropic.com/)
