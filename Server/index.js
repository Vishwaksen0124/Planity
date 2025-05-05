import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConnection } from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import redisClient from "./utils/redis.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost", "http://localhost:80"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", routes);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routeNotFound);
app.use(errorHandler);

// Graceful shutdown
if (process.env.NODE_ENV !== "test") {
    redisClient.connect().catch((err) => {
        console.error("Redis connection error:", err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Received SIGINT. Performing graceful shutdown...');
        await redisClient.quit();
        process.exit(0);
    });
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

