# Your Planity Render Setup - Ready to Deploy! 🚀

Your MongoDB Atlas connection string has been configured. Follow these steps to update your existing Render instance.

## 🎯 Your MongoDB Atlas Configuration

**Connection String**:
```
mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity?retryWrites=true&w=majority
```

**Database Name**: `planity`
**Username**: `vishwaksenp22_db_user`
**Password**: `Vishwaksen2`

> ⚠️ **Security Note**: This connection string contains your password. Keep it secure!

## 🚀 Update Your Existing Render Backend (5 minutes)

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com/
2. Find your backend service (likely named `planity-backend` or similar)
3. Click on it

### Step 2: Update Environment Variables
Click on **"Environment"** tab and update/add these variables:

#### Required Variables:

**MONGODB_URI**
```
mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity?retryWrites=true&w=majority
```

**NODE_ENV**
```
production
```

**JWT_SECRET**
```
planity-super-secret-jwt-key-2024-change-in-production
```
> ⚠️ Generate a new one with: `openssl rand -base64 32`

**CORS_ORIGINS**
```
https://planity-1.onrender.com,https://planity-4l0m.onrender.com
```

#### Optional Variables:

**REDIS_URL**
```
(leave empty or remove this variable)
```
> Note: App works fine without Redis

**PORT**
```
8800
```
> Note: Render sets this automatically, can omit

### Step 3: Save Changes
1. Click **"Save Changes"** button
2. Render will automatically redeploy (takes 2-3 minutes)
3. Watch the logs for any errors

### Step 4: Verify Backend is Working
After deployment completes:

**Test Health Endpoint:**
```bash
curl https://planity-4l0m.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-13T...",
  "uptime": 123.45
}
```

**Check API Documentation:**
Visit: https://planity-4l0m.onrender.com/api-docs

## 🎨 Update Your Frontend (If Needed)

Your frontend should already be configured, but verify these settings:

### Step 1: Go to Frontend Static Site
1. In Render Dashboard, find your frontend site
2. Click on it
3. Go to **"Environment"** tab

### Step 2: Verify Environment Variables

**VITE_APP_BASE_URL**
```
https://planity-4l0m.onrender.com
```

**VITE_APP_FIREBASE_API_KEY**
```
AIzaSyBdGaghOuUPp6q0WiFskUOlonZDIFWhchA
```

### Step 3: Save if Changed
- Only save if you made changes
- Frontend will rebuild (takes 3-5 minutes)

## ✅ Testing Your Deployment

### 1. Backend Tests
```bash
# Health check
curl https://planity-4l0m.onrender.com/health

# Should return: {"status":"ok","timestamp":"...","uptime":...}
```

### 2. Frontend Tests
1. Visit: https://planity-1.onrender.com
2. Should load login page without errors

### 3. Integration Tests
1. **Login as Admin**:
   - Email: `admin@gmail.com`
   - Password: `123456`
   - Should successfully login and see dashboard

2. **Create a Task**:
   - Go to Tasks page
   - Click "Create Task"
   - Fill in details
   - Submit
   - Task should appear in list

3. **Check MongoDB Atlas**:
   - Go to: https://cloud.mongodb.com/
   - Navigate to your cluster
   - Click "Collections"
   - You should see `planity` database with `tasks` collection

## 🔍 Monitoring

### Check Render Logs
1. Go to backend service
2. Click **"Logs"** tab
3. Look for:
   - ✅ "Connected to MongoDB" or "DB connection established"
   - ✅ "Server running on port 8800"
   - ✅ "Connected to Redis" (or "Redis client not initialized" - both OK)

### Check MongoDB Atlas
1. Go to: https://cloud.mongodb.com/
2. Click on your cluster
3. View **"Metrics"** tab:
   - Should see active connections
   - Should see operations

## 🐛 Troubleshooting

### Issue: Backend won't start

**Check Render Logs for errors:**
1. Common error: "Authentication failed"
   - Verify MongoDB URI is copied correctly
   - Check for extra spaces

2. Common error: "Network timeout"
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is whitelisted
   - Or add Render IPs

### Issue: "Database connection failed"

**Verify MongoDB Atlas Setup:**
1. **Database User**:
   - Go to Database Access
   - User `vishwaksenp22_db_user` should exist
   - Should have "Read and write to any database" privileges

2. **Network Access**:
   - Go to Network Access
   - Should have `0.0.0.0/0` (Allow from Anywhere)
   - Or specific Render IPs

3. **Cluster Running**:
   - Go to Database
   - Cluster should show "Active"

### Issue: Frontend can't connect to backend

**Check CORS:**
1. Backend logs should NOT show CORS errors
2. Verify `CORS_ORIGINS` includes your frontend URL
3. Check browser console for errors

## 🔒 Security Next Steps (Important!)

After successful deployment, improve security:

### 1. Change Default Passwords
Login to your app and change:
- Admin password (currently: `123456`)
- All test user passwords

### 2. Generate New JWT Secret
```bash
# Generate strong secret
openssl rand -base64 32

# Copy output and update JWT_SECRET in Render
```

### 3. Restrict MongoDB Access (Optional but Recommended)
1. Go to MongoDB Atlas → Network Access
2. Instead of `0.0.0.0/0`, add specific Render IPs
3. Find Render IPs at: https://render.com/docs/static-outbound-ip-addresses

## 📊 Your Deployment URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://planity-1.onrender.com | Main application |
| **Backend** | https://planity-4l0m.onrender.com | API server |
| **Health Check** | https://planity-4l0m.onrender.com/health | Server status |
| **API Docs** | https://planity-4l0m.onrender.com/api-docs | API documentation |
| **MongoDB Atlas** | https://cloud.mongodb.com/ | Database dashboard |

## 🎯 Success Checklist

- [ ] Backend deployed with MongoDB Atlas URI
- [ ] Health endpoint returns "ok"
- [ ] API docs are accessible
- [ ] Frontend loads without errors
- [ ] Can login with admin account
- [ ] Can create and view tasks
- [ ] Tasks appear in MongoDB Atlas
- [ ] No errors in Render logs

## 📞 Quick Reference

### Default Test Accounts
```
Admin:     admin@gmail.com / 123456
Team Lead: user2@gmail.com / user2@gmail.com
User:      user@gmail.com / user@gmail.com
```

### MongoDB Atlas Credentials
```
Username: vishwaksenp22_db_user
Password: Vishwaksen2
Database: planity
Cluster:  cluster0.dztqmo5.mongodb.net
```

### Important Commands
```bash
# Test backend health
curl https://planity-4l0m.onrender.com/health

# Generate new JWT secret
openssl rand -base64 32

# Check MongoDB connection (from your machine)
mongosh "mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity"
```

## 🎉 You're All Set!

Your Planity application is now configured for production deployment on Render with MongoDB Atlas!

**Next Steps:**
1. Update environment variables in Render (see Step 2 above)
2. Wait for deployment to complete
3. Test the application
4. Change default passwords
5. Enjoy your production app! 🚀

---

**Need more help?**
- See: `QUICK-UPDATE-GUIDE.md` for detailed walkthrough
- See: `RENDER-DEPLOYMENT.md` for complete deployment guide
- See: `RENDER-SETUP-CHECKLIST.md` for step-by-step checklist

**Created:** 2024-03-13
