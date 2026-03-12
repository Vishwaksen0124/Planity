import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import morgan from "morgan";
import { dbConnection } from "./utils/index.js"
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js"
import fs from "fs"
import path from "path";
import redisClient from "./utils/redis.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 8800

const app = express()

// Get CORS origins from environment variable or use defaults
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost", "http://localhost:80", "https://planity-1.onrender.com"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

// Ensure logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logsDir, "access.log"), { flags: "a" });

// Use combined format in production, dev format otherwise
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logStream }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use("/api", routes);

// Load swagger documentation
try {
    const swaggerDocument = YAML.load('./swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.error('Failed to load swagger documentation:', error.message);
}

app.use(routeNotFound)
app.use(errorHandler)

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Performing graceful shutdown...`);

    try {
        // Close Redis connection if it exists
        if (redisClient && typeof redisClient.quit === 'function') {
            await redisClient.quit();
            console.log('Redis connection closed');
        }

        // Close MongoDB connection
        const mongoose = await import('mongoose');
        await mongoose.default.connection.close();
        console.log('MongoDB connection closed');

        process.exit(0);
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
})