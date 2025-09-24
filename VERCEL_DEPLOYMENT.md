# Vercel Deployment Guide

This guide will help you deploy your Meeting Transcription App to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your OpenAI API key
3. Your Claude API key (optional)
4. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect this as a Vite project

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

**For Secure Production Deployment (Recommended):**
```
OPENAI_API_KEY = your_openai_api_key_here
CLAUDE_API_KEY = your_claude_api_key_here
```

**For Development/Testing (Client-Side Keys):**
```
VITE_OPENAI_API_KEY = your_openai_api_key_here
VITE_CLAUDE_API_KEY = your_claude_api_key_here
```

**Security Options:**

1. **Secure Production Setup (Recommended)**: 
   - Use `OPENAI_API_KEY` and `CLAUDE_API_KEY` (without VITE_ prefix)
   - API keys are kept secure on the server side
   - Uses Vercel serverless functions as proxy

2. **Development Setup**: 
   - Use `VITE_OPENAI_API_KEY` and `VITE_CLAUDE_API_KEY`
   - API keys are exposed in client-side code
   - Suitable for development and testing only

### 4. Deploy

1. Click **Deploy** in the Vercel dashboard
2. Vercel will automatically build and deploy your app
3. You'll get a live URL (e.g., `https://your-app.vercel.app`)

## Build Configuration

The app is configured with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables

### Secure Production Variables (Recommended)
| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key (server-side only) | Yes |
| `CLAUDE_API_KEY` | Claude API key (server-side only) | No |

### Development Variables (Client-Side)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | OpenAI API key (exposed in browser) | Yes |
| `VITE_CLAUDE_API_KEY` | Claude API key (exposed in browser) | No |

## Security Considerations

### Secure Production Setup (Included)
- ✅ API keys kept secure on server side
- ✅ Vercel serverless functions as proxy
- ✅ Automatic fallback to direct API calls
- ✅ Rate limiting through Vercel
- ✅ No API keys exposed in browser

### Development Setup (Client-Side API Keys)
- ✅ Quick to deploy
- ✅ No backend required
- ❌ API keys visible in browser
- ❌ Potential for abuse

### Additional Security Measures
For enhanced security, consider:

1. **Authentication**: Add user authentication
2. **Rate Limiting**: Implement custom usage limits
3. **API Key Rotation**: Regular key updates
4. **Monitoring**: Track API usage and costs

## Troubleshooting

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure environment variables are set correctly
- Review build logs in Vercel dashboard

### API Issues
- Verify API keys are correct
- Check API quotas and billing
- Test API connectivity using the built-in test functions

### CORS Issues
- The app makes direct API calls to OpenAI and Anthropic
- These APIs support CORS for browser requests
- No additional CORS configuration needed

## Performance Optimization

The app is optimized for production with:
- Code splitting for vendor libraries
- Minified builds
- Optimized bundle sizes
- Static asset optimization

## Monitoring

Monitor your deployment:
- **Vercel Analytics**: Built-in performance monitoring
- **API Usage**: Monitor OpenAI and Claude API usage
- **Error Tracking**: Check Vercel function logs

## Custom Domain

To use a custom domain:
1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Updates

To update your deployment:
1. Push changes to your Git repository
2. Vercel automatically redeploys
3. Preview deployments for pull requests

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
