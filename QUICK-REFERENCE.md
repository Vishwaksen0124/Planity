# 🚀 Planity - Quick Reference Card

## 🔐 MongoDB Atlas Connection
```
mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity?retryWrites=true&w=majority
```

## 👥 Test Accounts (Already Created in Database!)
```
Admin:     admin@gmail.com     / 123456
Team Lead: user2@gmail.com     / user2@gmail.com  
User:      user@gmail.com      / user@gmail.com
```

## 🌐 Deployment URLs
```
Frontend:   https://planity-1.onrender.com
Backend:    https://planity-4l0m.onrender.com
Health:     https://planity-4l0m.onrender.com/health
API Docs:   https://planity-4l0m.onrender.com/api-docs
```

## ⚡ Deploy to Render (5 Steps)

### 1. Go to Backend Service
https://dashboard.render.com/ → Your backend service → Environment

### 2. Update These Variables:
```
MONGODB_URI = mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity?retryWrites=true&w=majority

NODE_ENV = production

JWT_SECRET = planity-super-secret-jwt-key-2024-change-in-production

CORS_ORIGINS = https://planity-1.onrender.com,https://planity-4l0m.onrender.com

REDIS_URL = (leave empty or remove)
```

### 3. Save Changes
Click "Save Changes" and wait 2-3 minutes for deployment

### 4. Verify Backend
```bash
curl https://planity-4l0m.onrender.com/health
```
Should return: `{"status":"ok",...}`

### 5. Test Login
Visit: https://planity-1.onrender.com
Login: admin@gmail.com / 123456

## 💻 Local Development

### Start Backend
```bash
cd Server
npm install
npm start
```

### Start Frontend
```bash
cd Client
npm install
npm run dev
```

### Test Locally
```bash
# Backend health
curl http://localhost:8800/health

# Login
Visit: http://localhost:3000
Use: admin@gmail.com / 123456
```

## 🛠️ Useful Commands

```bash
# Create admin user
cd Server && npm run seed:admin

# Create all test users
cd Server && npm run seed:users

# Generate JWT secret
openssl rand -base64 32

# Test backend
curl https://planity-4l0m.onrender.com/health

# Connect to MongoDB
mongosh "mongodb+srv://vishwaksenp22_db_user:Vishwaksen2@cluster0.dztqmo5.mongodb.net/planity"
```

## 📚 Documentation

- **YOUR-RENDER-SETUP.md** - Your personalized deployment guide ⭐
- **QUICK-UPDATE-GUIDE.md** - Quick update for existing Render instance
- **RENDER-DEPLOYMENT.md** - Complete deployment guide
- **CREATE-ADMIN-USER.md** - User management guide
- **FINAL-SUMMARY.txt** - Complete summary of changes

## ⚠️ After Deployment

1. Change admin password (currently: 123456)
2. Change test user passwords
3. Generate new JWT_SECRET
4. Monitor MongoDB Atlas dashboard
5. Check Render logs regularly

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (0.0.0.0/0)

### Can't login
- Check backend health endpoint
- Verify users exist in MongoDB Atlas
- Check browser console for errors

### Frontend can't connect
- Verify VITE_APP_BASE_URL in frontend
- Check CORS_ORIGINS in backend
- Test backend health endpoint

## 📞 Support

- Check logs: Render dashboard → Your service → Logs
- MongoDB Atlas: https://cloud.mongodb.com/
- API Documentation: https://planity-4l0m.onrender.com/api-docs

---

**🎯 Next Step:** Follow **YOUR-RENDER-SETUP.md** to deploy!
