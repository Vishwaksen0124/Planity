import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, vi, afterEach } from "vitest";
import Dashboard from "../Dashboard"; // Adjust if your path is different
import { useGetDashboardStatsQuery } from "../../redux/slices/api/taskApiSlice";
import { useSelector } from "react-redux";

// --- Mocks ---

vi.mock("../../redux/slices/api/taskApiSlice", () => ({
    useGetDashboardStatsQuery: vi.fn(),
}));

vi.mock("react-redux", () => ({
    ...vi.importActual("react-redux"),
    useSelector: vi.fn(),
}));

vi.mock("../../components/Chart", () => ({
    Chart: () => <div data-testid="chart-component">Chart Component</div>,
}));


vi.mock("../../components/UserInfo", () => ({
    default: () => <div data-testid="user-info">User Info</div>,
}));

vi.mock("../../components/Loader", () => ({
    default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});


// --- Helper for rendering with router ---
const mockRender = (ui) => {
    return render(
        <BrowserRouter>
            {ui}
        </BrowserRouter>
    );
};

// --- Tests ---

describe("Dashboard Page", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("shows loading initially", () => {
        useSelector.mockReturnValue({ role: "Admin" });
        useGetDashboardStatsQuery.mockReturnValue({ isLoading: true });

        mockRender(<Dashboard />);

        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("redirects if user is not Admin", () => {
        useSelector.mockReturnValue({ role: "User" });

        mockRender(<Dashboard />);

        expect(screen.queryByText(/Chart by Priority/i)).not.toBeInTheDocument();
    });

    test("renders dashboard data correctly", async () => {
        useSelector.mockReturnValue({ role: "Admin" });

        useGetDashboardStatsQuery.mockReturnValue({
            isLoading: false,
            data: {
                totalTasks: 10,
                tasks: {
                    completed: 5,
                    "in progress": 3,
                    todo: 2,
                },
                graphData: [],
                last10Task: [
                    {
                        title: "Test Task",
                        priority: "high",
                        stage: "todo",
                        team: [{ name: "Alice" }],
                        date: new Date(),
                    },
                ],
                users: [
                    {
                        _id: "user1",
                        name: "John Doe",
                        role: "User",
                        createdAt: new Date(),
                    },
                ],
            },
        });

        mockRender(<Dashboard />);

        // Cards
        expect(await screen.findByText(/TOTAL TASK/i)).toBeInTheDocument();
        expect(screen.getByText(/COMPLETED TASK/i)).toBeInTheDocument();
        expect(screen.getByText(/TASK IN PROGRESS/i)).toBeInTheDocument();
        expect(screen.getByText(/TODO/i)).toBeInTheDocument();

        // Chart
        expect(screen.getByTestId("chart-component")).toBeInTheDocument();

        // TaskTable
        expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
        expect(screen.getByText(/high/i)).toBeInTheDocument();

        // UserTable
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
});
