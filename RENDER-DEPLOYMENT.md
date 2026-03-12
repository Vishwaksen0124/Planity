# Deploying Planity to Render with MongoDB Atlas

Complete guide to deploy your full-stack Planity application on Render using MongoDB Atlas.

## Prerequisites

- GitHub account with your Planity repository
- MongoDB Atlas account (free tier available)
- Render account (free tier available)
- Firebase project for file uploads

## Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a **FREE** M0 cluster:
   - Click "Build a Database"
   - Choose "Shared" (FREE)
   - Select your preferred region
   - Name your cluster (e.g., "Cluster0")
   - Click "Create"

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Username: `planity-user` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 1.3 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Render deployment)
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

> ⚠️ **Note**: For production, consider using Render's IP addresses or VPC peering for better security.

### 1.4 Get Connection String

1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials
7. Add database name: `planity`
   ```
   mongodb+srv://planity-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/planity?retryWrites=true&w=majority
   ```

## Step 2: Prepare Your Repository

### 2.1 Update Environment Files

Your `.env` files should **NOT** be committed to git. They're already in `.gitignore`.

### 2.2 Create Build Configuration

Create `/Server/render.yaml`:
```yaml
services:
  - type: web
    name: planity-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8800
```

### 2.3 Verify Package.json Scripts

Ensure your `Server/package.json` has:
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `planity-backend` (or your existing service name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `Server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or your preference)

### 3.2 Add Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `8800` | Render will override with $PORT |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate strong secret | Use: `openssl rand -base64 32` |
| `REDIS_URL` | Leave empty or add Upstash | Optional - app works without Redis |
| `CORS_ORIGINS` | `https://planity-1.onrender.com,https://your-frontend.onrender.com` | Your frontend URLs |

### 3.3 Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes for first deploy)
3. Note your backend URL: `https://planity-backend.onrender.com`

## Step 4: Deploy Frontend to Render

### 4.1 Update Client Environment

Your frontend needs to connect to the backend. Render will inject build-time environment variables.

### 4.2 Create Static Site

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `planity-frontend`
   - **Branch**: `main`
   - **Root Directory**: `Client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 4.3 Add Build Environment Variables

| Key | Value |
|-----|-------|
| `VITE_APP_BASE_URL` | `https://planity-4l0m.onrender.com` (your backend URL) |
| `VITE_APP_FIREBASE_API_KEY` | Your Firebase API key |

### 4.4 Deploy

1. Click "Create Static Site"
2. Wait for build and deployment
3. Your frontend will be at: `https://planity-frontend.onrender.com`

## Step 5: Update Backend CORS

After frontend is deployed, update backend environment variables:

1. Go to your backend service on Render
2. Navigate to "Environment"
3. Update `CORS_ORIGINS`:
   ```
   https://planity-1.onrender.com,https://planity-frontend.onrender.com
   ```
4. Click "Save Changes" (backend will redeploy)

## Step 6: Configure Custom Domain (Optional)

### For Backend
1. Go to backend service → Settings → Custom Domain
2. Add your domain: `api.yourdomain.com`
3. Update DNS records as instructed by Render

### For Frontend
1. Go to static site → Settings → Custom Domain
2. Add your domain: `yourdomain.com` or `www.yourdomain.com`
3. Update DNS records

## Step 7: Setup Redis (Optional - for Better Performance)

### Option 1: Upstash Redis (Recommended - Free Tier)

1. Go to [Upstash](https://upstash.com/)
2. Create account and Redis database
3. Copy the Redis URL
4. Add to Render environment variable: `REDIS_URL`

### Option 2: Render Redis Add-on (Paid)

1. In backend service → Settings
2. Click "Add Redis"
3. Choose plan
4. Render will auto-inject `REDIS_URL`

> **Note**: App works without Redis - caching will be disabled but all features work.

## Updating Your Existing Render Instance

Since you mentioned there's already an instance running:

### Update Backend (Server)

1. Go to your existing backend service on Render
2. Navigate to "Environment" tab
3. **Update/Add these variables**:
   ```
   MONGODB_URI=mongodb+srv://your-atlas-connection-string
   JWT_SECRET=your-strong-secret-key
   NODE_ENV=production
   CORS_ORIGINS=https://planity-1.onrender.com,https://planity-4l0m.onrender.com
   REDIS_URL=  (leave empty if not using)
   ```
4. Click "Save Changes"
5. Service will auto-redeploy

### Update Frontend (Client)

1. Go to your frontend static site on Render
2. Navigate to "Environment" tab
3. **Update/Add these variables**:
   ```
   VITE_APP_BASE_URL=https://planity-4l0m.onrender.com
   VITE_APP_FIREBASE_API_KEY=AIzaSyBdGaghOuUPp6q0WiFskUOlonZDIFWhchA
   ```
4. Click "Save Changes"
5. Site will rebuild and redeploy

## Troubleshooting

### Backend Won't Start

**Check logs**:
```bash
# In Render dashboard, go to Logs tab
```

Common issues:
1. **MongoDB connection failed**: Verify Atlas connection string and IP whitelist
2. **Port already in use**: Render manages ports automatically
3. **Missing environment variables**: Check all required vars are set

### Frontend Can't Connect to Backend

1. Check `VITE_APP_BASE_URL` is correct
2. Verify backend CORS includes frontend URL
3. Check backend is running (visit `/health` endpoint)
4. Open browser console for CORS errors

### MongoDB Atlas Connection Issues

1. **Authentication failed**:
   - Verify username and password in connection string
   - Check Database User has correct permissions

2. **Network timeout**:
   - Verify `0.0.0.0/0` is in Network Access
   - Check if Atlas cluster is active

3. **Database not found**:
   - Ensure database name is in connection string
   - MongoDB will create it on first connection

### Redis Connection Issues

If you see Redis errors but app still works:
- This is normal - app falls back to non-cached mode
- Either add Redis (Upstash) or remove `REDIS_URL` variable

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB Atlas connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `CORS_ORIGINS` | Allowed origins | `https://app.onrender.com` |

### Backend Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection (optional) | `redis://...` |
| `PORT` | Port (Render manages this) | `8800` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_BASE_URL` | Backend API URL | `https://api.onrender.com` |
| `VITE_APP_FIREBASE_API_KEY` | Firebase API key | `AIza...` |

## Health Check Endpoints

After deployment, verify:

### Backend Health
```bash
curl https://planity-4l0m.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-13T10:30:00.000Z",
  "uptime": 3600.5
}
```

### API Documentation
Visit: `https://planity-4l0m.onrender.com/api-docs`

## Performance Tips

1. **Use Redis**: Add Upstash Redis for better performance
2. **MongoDB Indexes**: Create indexes in Atlas for frequently queried fields
3. **Render Instance**: Upgrade from free tier to prevent cold starts
4. **CDN**: Use Cloudflare or similar for frontend
5. **Image Optimization**: Optimize Firebase uploads

## Security Best Practices

✅ Use strong JWT secrets (32+ characters)
✅ Never commit `.env` files
✅ Restrict MongoDB Atlas network access in production
✅ Enable SSL/TLS (Render provides this automatically)
✅ Regularly update dependencies
✅ Monitor logs for suspicious activity
✅ Use MongoDB Atlas backup features

## Monitoring

### Render Monitoring
- Check Render dashboard for:
  - Deploy logs
  - Service health
  - Resource usage

### MongoDB Atlas Monitoring
- Atlas dashboard provides:
  - Connection metrics
  - Query performance
  - Database size
  - Alerts

## Cost Optimization

### Free Tier Limits

**Render Free Tier**:
- Web services sleep after 15 minutes of inactivity
- 750 hours/month free compute
- First deploy can be slow

**MongoDB Atlas Free Tier**:
- 512 MB storage
- Shared cluster
- No credit card required

**Upstash Redis Free Tier**:
- 10,000 commands/day
- 256 MB storage

## Backup and Recovery

### MongoDB Atlas Backups
1. Go to Atlas dashboard
2. Navigate to "Backup" tab
3. Enable continuous backups (paid feature)
4. Or manually export data:
   ```bash
   mongodump --uri="mongodb+srv://..."
   ```

### Code Backups
- Keep code in GitHub (already done)
- Tag releases: `git tag v1.0.0 && git push --tags`

## Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Your API Docs**: `https://planity-4l0m.onrender.com/api-docs`

---

🎉 **Your Planity app is now deployed on Render with MongoDB Atlas!**
