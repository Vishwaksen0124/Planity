import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js"
import { cacheMiddleware } from "../utils/redis.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.post("/duplicate/:id", protectRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, cacheMiddleware(1800), dashboardStatistics);
router.get("/", protectRoute, cacheMiddleware(1800), getTasks);
router.get("/:id", protectRoute, cacheMiddleware(1800), getTask);

router.put("/create-subtask/:id", protectRoute, createSubTask);
router.put("/update/:id", protectRoute,  updateTask);
router.put("/:id", protectRoute, trashTask);

router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;