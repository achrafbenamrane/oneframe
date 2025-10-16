# Vercel Deployment Guide

## Required Environment Variables

You **must** set these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project (oneframe)
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables

#### Required Variables (copy from `.env.local`):

```
X_API_SECRET=1dec3afd088ecb3dae8d0d933152006f3afe79d8567fa86eaf75c0ecd0dcc8481161eef8df0ec6454fd354bea8cf6a9e6a55419ae2b63eba4fcb1e80b6a7b0330d0ad4d14c59b27b2592d486c42542851a0e04871e7b3fab6d9eaa2c825f8d01e5c59dd22e0b8d3d4a63dcb9722cf9dfdd238b719b8ed4a2275e77246c2c96a9

TELEGRAM_BOT_TOKEN=8326595822:AAFIwYxspDwJEyUCnBmUWOreXXSFPGeBbSE

TELEGRAM_CHAT_ID=5183767305

NEXT_PUBLIC_BASE_URL=https://www.oneframe.me
```

⚠️ **Important Notes:**
- `NEXT_PUBLIC_BASE_URL` must match your production domain exactly
- All variables should be set for **Production**, **Preview**, and **Development** environments
- After adding variables, you need to **redeploy** your project

### 3. Verify Variables Are Set

After adding them, you should see:
- ✅ X_API_SECRET (encrypted)
- ✅ TELEGRAM_BOT_TOKEN (encrypted)
- ✅ TELEGRAM_CHAT_ID (encrypted)
- ✅ NEXT_PUBLIC_BASE_URL (visible)

### 4. Redeploy

Two options:
1. **Recommended**: Go to **Deployments** tab → click the three dots on latest deployment → **Redeploy**
2. Or push a new commit to trigger automatic deployment

## Checking Logs on Vercel

If the form still fails after deployment:

1. Go to **Deployments** → click your latest deployment
2. Click **Functions** tab
3. Find `/api/thirdParty` and `/api/sendMessageTelegram`
4. Check logs for errors like:
   - "Missing environment variables"
   - "Server not configured"
   - Network/fetch errors

### Common Issues

| Error | Solution |
|-------|----------|
| `Server not configured` | Environment variables not set or misspelled |
| `fetch failed` | `NEXT_PUBLIC_BASE_URL` incorrect or missing |
| `Unauthorized` | `X_API_SECRET` doesn't match between routes |
| `Forbidden` | Origin not in allowedOrigins list |

## Testing After Deployment

1. Open browser console on https://www.oneframe.me
2. Fill out the newsletter or order form
3. Check console for errors
4. If you see 500 errors, check Vercel function logs immediately

## Optional: Custom Domains

If you add more domains (e.g., `oneframe.me` without www):
1. Add domain in Vercel project settings
2. Set `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://oneframe.me,https://preview.oneframe.me
   ```
