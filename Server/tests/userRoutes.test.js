import request from "supertest";
import app from "../app";
import { describe, it, expect, vi } from "vitest";

// Mock middleware
vi.mock("../middlewares/authMiddleware.js", () => ({
    protectRoute: (_req, _res, next) => next(),
    isAdminRoute: (_req, _res, next) => next(),
}));

// Mock controller
vi.mock("../controllers/userController.js", () => ({
    registerUser: (req, res) =>
        res.status(201).json({ user: { email: req.body.email }, status: true }),

    loginUser: (req, res) =>
        res.status(200).json({ token: "mockToken", status: true }),

    logoutUser: (_req, res) =>
        res.status(200).json({ message: "Logged out", status: true }),

    getTeamList: (_req, res) =>
        res.status(200).json({ team: ["User1", "User2"], status: true }),

    getNotificationsList: (_req, res) =>
        res.status(200).json({ notifications: ["Notification1"], status: true }),

    updateUserProfile: (req, res) =>
        res.status(200).json({ user: { name: req.body.name }, status: true }),

    markNotificationRead: (_req, res) =>
        res.status(200).json({ message: "Notifications marked as read", status: true }),

    changeUserPassword: (_req, res) =>
        res.status(200).json({ message: "Password changed", status: true }),

    activateUserProfile: (req, res) =>
        res.status(200).json({ message: `User ${req.params.id} activated`, status: true }),

    deleteUserProfile: (req, res) =>
        res.status(200).json({ message: `User ${req.params.id} deleted`, status: true }),
}));

describe("User Routes", () => {
    it("should register a user", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ email: "test@example.com", password: "pass123" });

        expect(res.statusCode).toBe(201);
        expect(res.body.user.email).toBe("test@example.com");
    });

    it("should login a user", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@example.com", password: "pass123" });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it("should logout a user", async () => {
        const res = await request(app).post("/api/users/logout");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out");
    });

    it("should return team list", async () => {
        const res = await request(app).get("/api/users/get-team");
        expect(res.statusCode).toBe(200);
        expect(res.body.team.length).toBeGreaterThan(0);
    });

    it("should return notifications", async () => {
        const res = await request(app).get("/api/users/notifications");
        expect(res.statusCode).toBe(200);
        expect(res.body.notifications.length).toBeGreaterThan(0);
    });

    it("should update user profile", async () => {
        const res = await request(app)
            .put("/api/users/profile")
            .send({ name: "Updated Name" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.name).toBe("Updated Name");
    });

    it("should mark notifications as read", async () => {
        const res = await request(app).put("/api/users/read-noti");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Notifications marked as read");
    });

    it("should change user password", async () => {
        const res = await request(app).put("/api/users/change-password");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Password changed");
    });

    it("should activate a user", async () => {
        const res = await request(app).put("/api/users/123");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/activated/);
    });

    it("should delete a user", async () => {
        const res = await request(app).delete("/api/users/123");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/);
    });
});
