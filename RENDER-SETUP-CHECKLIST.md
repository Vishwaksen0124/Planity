# Render Deployment Checklist ✅

Quick checklist for deploying/updating Planity on Render with MongoDB Atlas.

## 📋 Pre-Deployment Checklist

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created with password saved
- [ ] Network access set to `0.0.0.0/0` (Allow from Anywhere)
- [ ] Connection string copied and formatted:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/planity?retryWrites=true&w=majority
  ```

### Firebase Setup
- [ ] Firebase project created
- [ ] Firebase API key obtained
- [ ] Storage rules configured (if using file uploads)

### Render Account
- [ ] Render account created (free tier is fine)
- [ ] GitHub repository connected

## 🔧 Backend Deployment Checklist

### Render Backend Service Configuration
- [ ] Service name: `planity-backend` (or your choice)
- [ ] Environment: **Node**
- [ ] Branch: **main**
- [ ] Root Directory: **Server**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

### Backend Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `mongodb+srv://...` (your Atlas connection string)
- [ ] `JWT_SECRET` = `[Generate strong secret]` (use: `openssl rand -base64 32`)
- [ ] `CORS_ORIGINS` = `https://your-frontend.onrender.com`
- [ ] `REDIS_URL` = `` (leave empty if not using Redis)
- [ ] `PORT` = `8800` (optional, Render sets this automatically)

### Post-Deployment Verification
- [ ] Service deployed successfully
- [ ] Check logs for errors
- [ ] Test health endpoint: `curl https://your-backend.onrender.com/health`
- [ ] Should return: `{"status":"ok","timestamp":"...","uptime":...}`
- [ ] Check API docs: `https://your-backend.onrender.com/api-docs`

## 🎨 Frontend Deployment Checklist

### Render Static Site Configuration
- [ ] Site name: `planity-frontend` (or your choice)
- [ ] Branch: **main**
- [ ] Root Directory: **Client**
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: **dist**

### Frontend Environment Variables
- [ ] `VITE_APP_BASE_URL` = `https://planity-4l0m.onrender.com` (your backend URL)
- [ ] `VITE_APP_FIREBASE_API_KEY` = `AIza...` (your Firebase API key)

### Post-Deployment Verification
- [ ] Site built and deployed successfully
- [ ] Check build logs for errors
- [ ] Visit frontend URL
- [ ] Check browser console for errors
- [ ] Test login functionality

## 🔄 Update Backend CORS (After Frontend Deployed)

- [ ] Note frontend URL: `https://your-frontend.onrender.com`
- [ ] Go to backend service → Environment
- [ ] Update `CORS_ORIGINS` to include frontend URL:
  ```
  https://your-frontend.onrender.com,https://planity-1.onrender.com
  ```
- [ ] Save and wait for redeploy
- [ ] Test frontend can connect to backend

## 🧪 Testing Checklist

### Backend Tests
- [ ] Health check: `curl https://backend-url/health`
- [ ] API docs accessible: `https://backend-url/api-docs`
- [ ] MongoDB connection working (check logs)
- [ ] No Redis errors (or Redis connected if using)

### Frontend Tests
- [ ] Page loads without errors
- [ ] Login page displays
- [ ] Can login with test account
- [ ] Dashboard loads
- [ ] Can create a task
- [ ] Can view tasks
- [ ] Can logout

### Integration Tests
- [ ] Login with admin account: `admin@gmail.com` / `123456`
- [ ] Create a new task
- [ ] Assign task to user
- [ ] Login as user and view task
- [ ] Add subtask
- [ ] Change task status
- [ ] View dashboard analytics
- [ ] Test notifications

## 🔐 Security Checklist (Post-Deployment)

- [ ] Change default admin password
- [ ] Change default user passwords
- [ ] Generate new JWT_SECRET (not using default)
- [ ] Verify CORS only allows your frontend domains
- [ ] Review MongoDB Atlas security:
  - [ ] Consider restricting IP access (not 0.0.0.0/0)
  - [ ] Enable audit logs (paid feature)
  - [ ] Set up alerts for suspicious activity
- [ ] Enable HTTPS (Render does this automatically)
- [ ] Review environment variables (no secrets exposed)

## 📊 Monitoring Setup

### Render Monitoring
- [ ] Bookmark backend service URL
- [ ] Bookmark frontend site URL
- [ ] Set up Render email notifications for:
  - [ ] Failed deployments
  - [ ] Service down alerts

### MongoDB Atlas Monitoring
- [ ] Bookmark Atlas dashboard
- [ ] Review default alerts
- [ ] Set up custom alerts:
  - [ ] Connections threshold
  - [ ] Storage usage
  - [ ] Query performance

## 🚀 Performance Optimization (Optional)

### Redis Caching
- [ ] Sign up for Upstash Redis (free tier)
- [ ] Get Redis connection URL
- [ ] Add `REDIS_URL` to backend environment
- [ ] Redeploy backend
- [ ] Verify Redis connection in logs

### Render Upgrades
- [ ] Consider paid plan to avoid cold starts ($7/mo)
- [ ] Enable autoscaling if needed
- [ ] Set up custom domain (optional)

### MongoDB Atlas Optimization
- [ ] Create indexes for frequently queried fields:
  - [ ] User email
  - [ ] Task status
  - [ ] Task assigned users
- [ ] Enable MongoDB backups (paid feature)

## 📱 Client Configuration

### Update Local Development
- [ ] Update `Client/.env` for local dev:
  ```
  VITE_APP_BASE_URL=http://localhost:8800
  VITE_APP_FIREBASE_API_KEY=your-key
  ```
- [ ] Test local development still works

## 📚 Documentation Updates

- [ ] Update README with your deployment URLs
- [ ] Document any custom configurations
- [ ] Save MongoDB Atlas connection string securely
- [ ] Save all passwords in password manager
- [ ] Document any troubleshooting steps you discovered

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
- [ ] Check MongoDB URI is correct
- [ ] Verify Atlas user credentials
- [ ] Check Atlas network access (0.0.0.0/0)
- [ ] Review Render logs for specific error

### Issue: Frontend can't connect to backend
- [ ] Verify `VITE_APP_BASE_URL` is correct
- [ ] Check backend CORS includes frontend URL
- [ ] Test backend health endpoint
- [ ] Check browser console for CORS errors

### Issue: MongoDB connection timeout
- [ ] Verify Atlas cluster is running
- [ ] Check network access whitelist
- [ ] Test connection string locally
- [ ] Check MongoDB Atlas status page

### Issue: Redis errors
- [ ] This is OK if not using Redis
- [ ] App works without Redis (caching disabled)
- [ ] Either add Redis URL or remove the variable

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Backend health endpoint returns "ok"
- ✅ Frontend loads without console errors
- ✅ Can login with test accounts
- ✅ Can create, view, and manage tasks
- ✅ Dashboard displays correctly
- ✅ MongoDB Atlas shows connections
- ✅ No critical errors in Render logs

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Firebase Docs**: https://firebase.google.com/docs
- **Your API Docs**: `https://your-backend.onrender.com/api-docs`

## 🔄 Regular Maintenance

### Weekly
- [ ] Check Render service health
- [ ] Review MongoDB Atlas metrics
- [ ] Check for application errors in logs

### Monthly
- [ ] Update dependencies (security patches)
- [ ] Review MongoDB storage usage
- [ ] Check Render resource usage
- [ ] Review user feedback

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Backup test restore
- [ ] Update documentation

---

✅ **All items checked? Your Planity app is production-ready on Render!**

Last updated: 2024-03-13
