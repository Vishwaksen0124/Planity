# Quick Update Guide for Existing Render Instance

Since you already have Planity running on Render, here's how to update it to use MongoDB Atlas.

## 🚀 Quick Steps (5 minutes)

### Step 1: Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/planity?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials

### Step 2: Update Backend Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service (probably `planity-backend` or similar)
3. Click on it
4. Go to "Environment" tab
5. **Add or update these variables**:

   ```
   MONGODB_URI = mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/planity?retryWrites=true&w=majority
   NODE_ENV = production
   JWT_SECRET = planity-super-secret-jwt-key-2024-change-in-production
   CORS_ORIGINS = https://planity-1.onrender.com,https://planity-4l0m.onrender.com
   REDIS_URL = (leave empty or remove this variable)
   ```

6. Click "Save Changes"
7. Backend will automatically redeploy (takes 2-3 minutes)

### Step 3: Update Frontend Environment Variables (if needed)

1. Go to your frontend static site on Render
2. Go to "Environment" tab
3. **Verify these variables**:

   ```
   VITE_APP_BASE_URL = https://planity-4l0m.onrender.com
   VITE_APP_FIREBASE_API_KEY = AIzaSyBdGaghOuUPp6q0WiFskUOlonZDIFWhchA
   ```

4. Click "Save Changes" if you made any changes
5. Frontend will rebuild (takes 3-5 minutes)

### Step 4: Verify Deployment

After both services finish deploying:

1. **Check backend health**:
   ```bash
   curl https://planity-4l0m.onrender.com/health
   ```

   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-03-13T...",
     "uptime": 123.45
   }
   ```

2. **Check frontend**: Visit `https://planity-1.onrender.com`

3. **Test login**: Try logging in with your test accounts

## 📋 Environment Variables Checklist

### Backend (Required)

- ✅ `MONGODB_URI` - Your MongoDB Atlas connection string
- ✅ `NODE_ENV` - Set to `production`
- ✅ `JWT_SECRET` - Your secret key (change from default!)
- ✅ `CORS_ORIGINS` - Your frontend URLs

### Backend (Optional)

- ⚪ `REDIS_URL` - Leave empty if not using Redis (app works fine without it)
- ⚪ `PORT` - Render sets this automatically, can omit

### Frontend (Required)

- ✅ `VITE_APP_BASE_URL` - Your backend URL on Render
- ✅ `VITE_APP_FIREBASE_API_KEY` - Your Firebase API key

## 🔧 If You Need to Create MongoDB Atlas Account

### Quick Setup (10 minutes)

1. **Sign up at MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Create account (free tier available)

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "Shared" (FREE M0)
   - Select region closest to your Render region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `planity-admin`
   - Password: Generate strong password (save it!)
   - Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere"
   - Enter `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Add database name: `/planity`

   Final format:
   ```
   mongodb+srv://planity-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/planity?retryWrites=true&w=majority
   ```

## 🐛 Troubleshooting

### Backend Won't Start After Update

1. **Check Render Logs**:
   - Go to your backend service
   - Click "Logs" tab
   - Look for error messages

2. **Common Issues**:
   - ❌ "Authentication failed" - Check MongoDB username/password
   - ❌ "Network timeout" - Check Atlas IP whitelist (should be 0.0.0.0/0)
   - ❌ "Database not found" - MongoDB will auto-create it, wait a moment

### Frontend Can't Connect to Backend

1. Check `VITE_APP_BASE_URL` is correct
2. Check backend logs - is it running?
3. Visit backend health endpoint: `https://planity-4l0m.onrender.com/health`

### Redis Errors (Can Ignore)

If you see Redis connection errors in logs:
- This is OK! App works without Redis
- Either remove `REDIS_URL` variable or leave it empty
- Redis is only used for caching (optional feature)

## 🎯 What Changes With MongoDB Atlas?

### Before (Local/Docker MongoDB):
- ❌ MongoDB running on same server
- ❌ Need to manage backups manually
- ❌ Limited storage
- ❌ No automatic scaling

### After (MongoDB Atlas):
- ✅ Cloud-hosted MongoDB
- ✅ Automatic backups (in paid tier)
- ✅ 512MB free storage
- ✅ Automatic scaling
- ✅ Better reliability
- ✅ Global deployment
- ✅ Monitoring dashboard

## 📊 Monitoring Your App

### Check MongoDB Atlas Dashboard
- Connections: See active connections
- Operations: Query performance
- Storage: Database size
- Alerts: Set up alerts for issues

### Check Render Dashboard
- Deployments: See deploy history
- Logs: Check application logs
- Metrics: CPU, memory usage

## 🔐 Security Recommendations

After deploying:

1. **Change Default Passwords** ⚠️
   - Admin: `admin@gmail.com` / `123456`
   - Update in your database or through app

2. **Use Strong JWT Secret**
   - Generate with: `openssl rand -base64 32`
   - Update in Render environment variables

3. **Restrict MongoDB Access** (Production)
   - In Atlas Network Access
   - Add specific Render IPs instead of 0.0.0.0/0

4. **Enable MongoDB Backups**
   - Go to Atlas Backup tab
   - Enable continuous backups (paid feature)

## ⚡ Performance Tips

1. **Add Redis** (Optional - Better Performance)
   - Sign up for [Upstash Redis](https://upstash.com/) (free tier)
   - Add `REDIS_URL` to Render environment
   - App will cache API responses

2. **Upgrade Render Plan** (Prevents Sleep)
   - Free tier sleeps after 15 min inactivity
   - Paid plans ($7/mo) stay active

3. **Use MongoDB Indexes** (For Large Data)
   - Create indexes in Atlas for faster queries
   - Common indexes: email, task status, user ID

## 📱 Test Your Deployment

1. ✅ Visit frontend: https://planity-1.onrender.com
2. ✅ Check health: https://planity-4l0m.onrender.com/health
3. ✅ API docs: https://planity-4l0m.onrender.com/api-docs
4. ✅ Login with test account
5. ✅ Create a task
6. ✅ Check MongoDB Atlas to see data

## 🆘 Need Help?

1. Check Render logs for errors
2. Check MongoDB Atlas connection
3. Review environment variables
4. See full guide: `RENDER-DEPLOYMENT.md`

---

✅ **Update complete! Your app now uses MongoDB Atlas.**

Next recommended steps:
1. Change default user passwords
2. Update JWT_SECRET to a strong value
3. Test all features work correctly
4. Monitor Atlas dashboard for database health
