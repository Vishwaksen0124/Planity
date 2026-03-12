# Planity - Production Deployment Guide

## Prerequisites

- Node.js 20.x or higher
- MongoDB 7.x or higher
- Redis 7.x or higher
- Docker & Docker Compose (for containerized deployment)

## Environment Configuration

### Server Environment Variables

Create `/Server/.env` file with the following variables:

```env
# Server Configuration
PORT=8800
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/planity

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://yourfrontend.com
```

### Client Environment Variables

Create `/Client/.env` file with the following variables:

```env
# Firebase Configuration
VITE_APP_FIREBASE_API_KEY=your-firebase-api-key

# Backend API URL
VITE_APP_BASE_URL=http://localhost:8800
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. **Setup Environment Variables**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env and add your actual values
   nano .env
   ```

2. **Build and Start Services**
   ```bash
   docker-compose up -d
   ```

3. **Check Service Status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Access Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8800
   - API Documentation: http://localhost:8800/api-docs
   - Health Check: http://localhost:8800/health

### Option 2: Manual Deployment

#### 1. Install Dependencies

```bash
# Server
cd Server
npm install --production

# Client
cd ../Client
npm install
```

#### 2. Start MongoDB and Redis

```bash
# MongoDB
mongod --dbpath /path/to/db

# Redis
redis-server
```

#### 3. Configure Environment

```bash
# Server
cd Server
cp .env.example .env
# Edit .env with your values

# Client
cd ../Client
cp .env.example .env
# Edit .env with your values
```

#### 4. Build Client

```bash
cd Client
npm run build
```

#### 5. Start Server

```bash
cd Server
npm start
```

#### 6. Serve Client

```bash
cd Client
npm run start
# Or use a web server like nginx to serve the dist folder
```

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update CORS_ORIGINS with your actual frontend domain
- [ ] Configure Firebase with production credentials
- [ ] Set up SSL/TLS certificates (use Let's Encrypt)
- [ ] Configure MongoDB with authentication
- [ ] Set up Redis password protection
- [ ] Enable firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure automated backups for MongoDB
- [ ] Review and update rate limiting rules
- [ ] Test all API endpoints
- [ ] Verify CORS configuration
- [ ] Check environment variables are properly set

## Security Best Practices

1. **Never commit .env files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Generate using: `openssl rand -base64 32`
3. **Enable HTTPS** - Use SSL/TLS certificates in production
4. **Configure MongoDB authentication** - Don't use default configurations
5. **Set Redis password** - Protect your cache layer
6. **Use environment-specific configurations** - Different for dev/staging/prod
7. **Regular security updates** - Keep dependencies up to date
8. **Implement rate limiting** - Prevent abuse and DDoS attacks

## Monitoring

### Health Check Endpoint

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

### Application Logs

Server logs are stored in `/Server/logs/access.log`

```bash
# View logs
tail -f Server/logs/access.log

# Docker logs
docker-compose logs -f server
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
systemctl status mongodb

# Check connection
mongosh --eval "db.adminCommand('ping')"
```

### Redis Connection Issues

```bash
# Check Redis status
redis-cli ping

# Check Redis connection
redis-cli --stat
```

### Server Not Starting

```bash
# Check logs
cat Server/logs/access.log

# Check if port is available
netstat -tuln | grep 8800

# Verify environment variables
cd Server && node -e "require('dotenv').config(); console.log(process.env)"
```

## Scaling Considerations

1. **Database Scaling**: Use MongoDB replica sets for high availability
2. **Caching**: Redis cluster for distributed caching
3. **Load Balancing**: Use nginx or HAProxy for multiple server instances
4. **CDN**: Serve static assets through a CDN
5. **Monitoring**: Implement application monitoring (e.g., PM2, New Relic)

## Backup and Recovery

### MongoDB Backup

```bash
# Create backup
mongodump --db planity --out /path/to/backup

# Restore backup
mongorestore --db planity /path/to/backup/planity
```

### Redis Backup

Redis automatically saves snapshots based on configuration. Check `/data/dump.rdb`

## Support

For issues or questions:
- Check application logs
- Review API documentation at `/api-docs`
- Verify environment configuration
- Check database connectivity
