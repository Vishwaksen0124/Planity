# Planity - Task Management System

A full-stack task management application designed to empower teams of all sizes to achieve their goals efficiently by organizing tasks, managing resources, and improving communication.

## 🌟 Features

- **Multi-Role Access Control**: Support for Admin, Team Lead, and User roles
- **Task Management**: Create, assign, update, and track tasks
- **Team Collaboration**: Manage team members and assignments
- **Dashboard Analytics**: Visualize team performance and task statistics
- **Subtask Management**: Break down tasks into manageable subtasks
- **Trash & Restore**: Soft delete and restore tasks
- **Real-time Notifications**: Stay updated on task assignments and changes
- **Redis Caching**: Improved performance with intelligent caching
- **API Documentation**: Interactive Swagger documentation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🎯 User Roles

### Admin
- Full system access
- Create, edit, and delete users and team leads
- Assign and manage all tasks
- View comprehensive dashboard analytics
- Restore trashed tasks
- Manage team structure

### Team Lead
- View team members
- Assign tasks to users
- Delete and manage tasks
- Monitor team progress
- Add subtasks

### User
- View assigned tasks
- Add subtasks to assigned tasks
- Update task status
- Track personal task progress

## 🚀 Quick Start

### Prerequisites

**For Local Development:**
- Node.js 20.x or higher
- MongoDB 7.x (local) OR MongoDB Atlas account (cloud)
- Redis 7.x (optional - for caching)
- Docker & Docker Compose (optional)

**For Render Deployment:**
- MongoDB Atlas account (free tier available)
- Render account (free tier available)
- Firebase project for file uploads

### Option 1: Docker (Recommended for Production)

1. **Clone and setup**
   ```bash
   git clone https://github.com/Vishwaksen0124/Planity.git
   cd Planity
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8800
   - API Docs: http://localhost:8800/api-docs
   - Health Check: http://localhost:8800/health

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishwaksen0124/Planity.git
   cd Planity
   ```

2. **Setup Server**
   ```bash
   cd Server
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   ```

3. **Setup Client**
   ```bash
   cd ../Client
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   ```

4. **Start MongoDB and Redis**
   ```bash
   # MongoDB
   mongod

   # Redis (in another terminal)
   redis-server
   ```

5. **Start Server** (Terminal 1)
   ```bash
   cd Server
   npm run dev
   ```

6. **Start Client** (Terminal 2)
   ```bash
   cd Client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8800

## 🔐 Default Test Accounts

### Admin Account
- Email: `admin@gmail.com`
- Password: `123456`

### Team Lead Account
- Email: `user2@gmail.com`
- Password: `user2@gmail.com`

### User Account
- Email: `user@gmail.com`
- Password: `user@gmail.com`

> ⚠️ **Security Note**: Change these credentials in production!

## 🛠️ Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite as build tool
- Firebase for file storage
- Recharts for data visualization

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- Redis for caching
- JWT for authentication
- Morgan for logging
- Swagger for API documentation

## 📁 Project Structure

```
Planity/
├── Client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── package.json
├── Server/                  # Express backend
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Express middlewares
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── tests/             # Test suites
│   ├── logs/              # Application logs
│   ├── swagger.yaml       # API documentation
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── DEPLOYMENT.md          # Deployment guide
└── README.md
```

## 🧪 Testing

### Run Backend Tests
```bash
cd Server
npm test
```

### Run Frontend Tests
```bash
cd Client
npm test
```

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:
- http://localhost:8800/api-docs

## 🐳 Docker Commands

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server

# Stop all containers
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# View running containers
docker ps
```

## 📊 Health Monitoring

Check application health:
```bash
curl http://localhost:8800/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-13T10:30:00.000Z",
  "uptime": 3600.5
}
```

## 🔧 Environment Variables

### Server (.env)
```env
PORT=8800
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/planity
JWT_SECRET=your-super-secret-key
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=http://localhost:3000
```

### Client (.env)
```env
VITE_APP_FIREBASE_API_KEY=your-firebase-api-key
VITE_APP_BASE_URL=http://localhost:8800
```

## 🚢 Production Deployment

### Render Deployment (Recommended)

For deploying on Render with MongoDB Atlas:
- 📘 **Complete Guide**: See [RENDER-DEPLOYMENT.md](./RENDER-DEPLOYMENT.md)
- ⚡ **Quick Update**: See [QUICK-UPDATE-GUIDE.md](./QUICK-UPDATE-GUIDE.md) if you already have an instance running

### General Deployment

For other hosting platforms:
- 📘 See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions

### Quick Production Checklist
- [ ] Update all environment variables
- [ ] Change default user passwords
- [ ] Use strong JWT_SECRET
- [ ] Configure CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Enable MongoDB authentication
- [ ] Configure Redis password
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Review security settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 Scripts

### Server Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

### Client Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm start          # Serve production build
npm test           # Run tests
```

## 🔒 Security

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Keep dependencies updated
- Follow OWASP security guidelines
- Implement rate limiting
- Use secure headers

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Powered by React, Node.js, MongoDB, and Redis
- API documentation with Swagger UI

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the API documentation at `/api-docs`
- Review the deployment guide
- Check application logs

---

Made with ❤️ by the Planity Team
