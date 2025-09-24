# 🔐 Vercel Environment Variables Setup

## Production Environment Variables (Secure)

Add these to your Vercel project dashboard under **Settings** → **Environment Variables**:

### Required Variables
```
OPENAI_API_KEY = sk-proj-your-openai-key-here
CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

### Optional Variables
```
NODE_ENV = production
```

## Development Environment Variables (Client-Side)

If you want to use client-side API keys for development:

```
VITE_OPENAI_API_KEY = sk-proj-your-openai-key-here
VITE_CLAUDE_API_KEY = sk-ant-your-claude-key-here
```

## Security Notes

### Production Setup (Recommended)
- ✅ **Server-side API keys** - Never exposed to browser
- ✅ **Secure proxy** - Vercel serverless functions handle API calls
- ✅ **Rate limiting** - Built-in Vercel protection
- ✅ **Error handling** - Secure error responses

### Development Setup
- ⚠️ **Client-side keys** - Exposed in browser
- ⚠️ **Direct API calls** - No server-side protection
- ⚠️ **Rate limiting** - Limited by API providers only

## Setup Instructions

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Add Production Variables**
   - Click **Add New**
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Environment: Production, Preview, Development
   - Click **Save**

3. **Add Claude Variable**
   - Click **Add New**
   - Name: `CLAUDE_API_KEY`
   - Value: Your Claude API key
   - Environment: Production, Preview, Development
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments**
   - Click **Redeploy** to apply new environment variables

## Verification

After setting up environment variables:

1. **Check Function Logs**
   - Go to **Functions** tab in Vercel dashboard
   - Look for successful API calls

2. **Test API Endpoints**
   - Visit your deployed app
   - Go to Settings → Test APIs
   - Should show "Working" status

3. **Monitor Usage**
   - Check OpenAI dashboard for API calls
   - Check Claude dashboard for API calls
   - Monitor Vercel function usage

## Troubleshooting

### Environment Variables Not Working
1. **Check variable names** - Must match exactly (case-sensitive)
2. **Verify deployment** - Redeploy after adding variables
3. **Check function logs** - Look for error messages
4. **Test locally** - Use `node debug-apis.js` to verify keys

### API Calls Failing
1. **Verify API keys** - Test with debug script
2. **Check quotas** - Ensure you have credits
3. **Monitor logs** - Check Vercel function logs
4. **Test endpoints** - Use browser dev tools to check network requests

## Best Practices

1. **Use Production Variables** - Keep API keys secure
2. **Monitor Usage** - Track API costs and usage
3. **Set Limits** - Configure usage limits in API dashboards
4. **Regular Updates** - Keep API keys fresh
5. **Error Handling** - Implement proper error responses
