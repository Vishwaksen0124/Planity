import request from "supertest";
import app from "../app";
import { describe, it, expect, vi } from "vitest";

// Mock auth middleware
vi.mock("../middlewares/authMiddleware.js", () => ({
    protectRoute: (_req, _res, next) => next(),
    isAdminRoute: (_req, _res, next) => next(),
}));

// Mock controller
vi.mock("../controllers/taskController.js", () => ({
    createTask: (req, res) =>
        res.status(201).json({ task: { title: req.body.title }, status: true }),

    getDashboardStats: (_req, res) =>
        res.status(200).json({ stats: { total: 10 }, status: true }),

    dashboardStatistics: (_req, res) =>
        res.status(200).json({
            stats: { total: 10 }, // <-- Add this
            message: "Dashboard stats success",
            status: true
        }),
    

    getTasks: (_req, res) =>
        res.status(200).json({ tasks: [{ id: "1", title: "Mock Task" }], status: true }),

    getTask: (req, res) =>
        res.status(200).json({ task: { id: req.params.id, title: "Mock Task" }, status: true }),

    getSingleTask: (req, res) =>
        res.status(200).json({ task: { id: req.params.id, title: "Single Task" }, status: true }),

    updateTask: (req, res) =>
        res.status(200).json({ message: "Task updated", updated: req.body.title, status: true }),

    duplicateTask: (req, res) =>
        res.status(200).json({ message: "Task duplicated successfully.", status: true }),

    trashTask: (req, res) =>
        res.status(200).json({ message: "Task moved to trash.", status: true }),

    postTaskActivity: (req, res) =>
        res.status(200).json({ message: "Activity posted", activity: req.body, status: true }),

    createSubTask: (req, res) =>
        res.status(201).json({ message: "Subtask created", subtask: req.body, status: true }),

    deleteRestoreTask: (req, res) =>
        res.status(200).json({ message: "Task deleted/restored successfully.", status: true }), // ← Add this
}));


describe("Task Routes", () => {
    it("should create a task", async () => {
        const res = await request(app)
            .post("/api/tasks/create")
            .send({ title: "Test Task", description: "Just testing" });

        expect(res.statusCode).toBe(201);
        expect(res.body.task.title).toBe("Test Task");
    });
    it("should get dashboard statistics", async () => {
        const res = await request(app).get("/api/tasks/dashboard");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("stats");
        expect(res.body.stats).toHaveProperty("total");
    });
    

    it("should return tasks", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.statusCode).toBe(200);
        expect(res.body.tasks.length).toBeGreaterThan(0);
    });

    it("should return a single task", async () => {
        const res = await request(app).get("/api/tasks/123");
        expect(res.statusCode).toBe(200);
        expect(res.body.task.id).toBe("123");
    });

    it("should update a task", async () => {
        const res = await request(app)
            .put("/api/tasks/update/123")
            .send({ title: "Updated" });

        expect(res.statusCode).toBe(200);
        expect(res.body.updated).toBe("Updated");
    });

    it("should delete a task", async () => {
        const res = await request(app).put("/api/tasks/123");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/trash/i);
    });

    it("should restore or delete a task", async () => {
        const res = await request(app).delete("/api/tasks/delete-restore/123");
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted|restored/i);
    });
    
    

    it("should duplicate a task", async () => {
        const res = await request(app).post("/api/tasks/duplicate/123");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Task duplicated successfully.");
    });

    it("should post task activity", async () => {
        const res = await request(app)
            .post("/api/tasks/activity/123")
            .send({ action: "started" });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Activity posted");
    });

    it("should create a subtask", async () => {
        const res = await request(app)
            .put("/api/tasks/create-subtask/123")
            .send({ title: "Subtask" });
    
        expect(res.statusCode).toBe(201);
        expect(res.body.subtask.title).toBe("Subtask");
    });
    
});
