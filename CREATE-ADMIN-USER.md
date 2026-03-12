# Create Admin User in MongoDB Atlas

Quick guide to create the admin user in your MongoDB Atlas database.

## 🎯 Admin User Details

- **Email**: `admin@gmail.com`
- **Password**: `123456`
- **Role**: Administrator
- **Permissions**: Full access

## 🚀 Method 1: Using Seed Script (Recommended)

### Step 1: Make sure .env is configured

Your `Server/.env` should have:
```env
MONGODB_URI=mongodb+srv://vishwaksenp22_db_user:DvwECI2sOa2UJWJU@cluster0.dztqmo5.mongodb.net/planity?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Run the seed script

```bash
cd Server
npm run seed:admin
```

This will:
- Connect to your MongoDB Atlas database
- Check if admin user exists
- Create admin user if not exists
- Update password if already exists

### Expected Output:
```
Connecting to MongoDB...
✅ Connected to MongoDB
Creating new admin user...
✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: admin@gmail.com
👤 Name: Admin User
🔑 Password: 123456
🛡️  Is Admin: true
✅ Is Active: true
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Database connection closed

🎉 Admin user is ready to use!

You can now login with:
  Email: admin@gmail.com
  Password: 123456
```

## 📋 Method 2: Create All Test Users

To create admin + test users (Team Lead and User):

```bash
cd Server
npm run seed:users
```

This creates:
1. **Admin**: admin@gmail.com / 123456
2. **Team Lead**: user2@gmail.com / user2@gmail.com
3. **User**: user@gmail.com / user@gmail.com

## 🔧 Method 3: Using MongoDB Atlas UI (Manual)

### Step 1: Go to MongoDB Atlas
1. Visit: https://cloud.mongodb.com/
2. Log in to your account
3. Select your cluster (`Cluster0`)
4. Click "Collections"

### Step 2: Create Database and Collection
If not exists:
1. Click "Create Database"
2. Database name: `planity`
3. Collection name: `users`
4. Click "Create"

### Step 3: Insert Admin User Document

Click "Insert Document" and paste this JSON:

```json
{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "$2a$10$5jFE9vXKFJvLvEtLsXh7HuyJEKULBFr7HNVtlP7aYm1ItlOh8hGHa",
  "title": "Administrator",
  "role": "Administrator",
  "isAdmin": true,
  "isActive": true,
  "createdAt": {
    "$date": "2024-03-13T00:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2024-03-13T00:00:00.000Z"
  }
}
```

> Note: The password hash above is for `123456`

### Step 4: Click "Insert"

## ✅ Verify Admin User Creation

### Option 1: Check in MongoDB Atlas
1. Go to MongoDB Atlas
2. Navigate to Collections
3. Select `planity` database
4. Select `users` collection
5. You should see the admin user

### Option 2: Test Login
1. Deploy your app or run locally
2. Go to login page
3. Use credentials:
   - Email: `admin@gmail.com`
   - Password: `123456`
4. Should successfully login

### Option 3: Use MongoDB Shell (Advanced)
```bash
mongosh "mongodb+srv://vishwaksenp22_db_user:DvwECI2sOa2UJWJU@cluster0.dztqmo5.mongodb.net/planity"

# In the shell:
db.users.findOne({email: "admin@gmail.com"})
```

## 🐛 Troubleshooting

### "Connection failed"
- Check internet connection
- Verify MongoDB Atlas connection string
- Ensure Network Access allows your IP (0.0.0.0/0)

### "Authentication failed"
- Check username and password in connection string
- Verify database user exists in Atlas

### "Admin user already exists"
- This is OK! Script will update the password
- Or you can use the existing admin user

### Script hangs or times out
- Check MongoDB Atlas cluster is active
- Verify connection string is correct
- Check firewall settings

## 🔒 Security Notes

⚠️ **Change Default Password in Production!**

After creating the admin user:
1. Login to your app
2. Go to profile/settings
3. Change password to something secure
4. Or use the change password API endpoint

### Generate Strong Password
```bash
# Generate a random password
openssl rand -base64 16
```

## 📊 What Each Script Does

### `npm run seed:admin`
- Creates only the admin user
- Updates password if user exists
- Quick and focused

### `npm run seed:users`
- Creates admin + test users
- Good for development/testing
- Creates:
  - Admin (full access)
  - Team Lead (manage tasks)
  - User (view assigned tasks)

## 🎯 Next Steps After Creating Admin

1. ✅ Login with admin credentials
2. ✅ Change the default password
3. ✅ Create other users through the app UI
4. ✅ Assign roles and permissions
5. ✅ Start creating tasks

## 📞 Need Help?

If you encounter issues:
1. Check the error message
2. Verify .env configuration
3. Check MongoDB Atlas connection
4. Try manual creation via Atlas UI

---

**Quick Command Reference:**
```bash
# Create only admin user
npm run seed:admin

# Create all test users
npm run seed:users

# Check if it worked (MongoDB Shell)
mongosh "your-connection-string"
db.users.find({email: "admin@gmail.com"})
```

**Login Credentials:**
```
Email: admin@gmail.com
Password: 123456
```

🎉 **You're all set! Go ahead and login!**
