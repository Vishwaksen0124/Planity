import express from "express";
import userRoutes from "./userRoutes.js"
import taskRoutes from "./taskRoutes.js"

const router = express.Router();

router.use("/users", userRoutes);  //api/users/login
router.use("/tasks", taskRoutes); //api/tasks/

export default router;