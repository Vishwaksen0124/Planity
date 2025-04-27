// Login.test.jsx

// 1. Mock react-router-dom FIRST
import { vi } from "vitest";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// 2. Imports
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/slices/authSlice";
import Login from "../Login";

// 3. Mock external components
vi.mock("../../components/Textbox", () => ({
    default: ({ label, register, errors }) => (
        <div data-testid="textbox">
            <label>{label}</label>
            <input {...register} />
            {errors && <span>{errors}</span>}
        </div>
    ),
}));

vi.mock("../../components/Button", () => ({
    default: ({ label }) => <button>{label}</button>,
}));

vi.mock("../../components/Loader", () => ({
    default: () => <div data-testid="loader">Loading...</div>,
}));

// 4. Mock API and toast
const mockLogin = vi.fn();
vi.mock("../../redux/slices/api/authApiSlice", () => ({
    useLoginMutation: () => [mockLogin, { isLoading: false }],
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn() },
}));

// 5. Helper to render with redux + router
const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState,
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>{ui}</MemoryRouter>
        </Provider>
    );
};

// 6. The tests
describe("Login Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders login form", () => {
        renderWithProviders(<Login />);

        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
        expect(screen.getByText(/Manage all your tasks/i)).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });

    test("shows error when submitting empty form", async () => {
        renderWithProviders(<Login />);

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(screen.getAllByText(/required/i)).toHaveLength(2);
        });
    });

    test("calls login and redirects admin", async () => {
        mockLogin.mockReturnValue({
            unwrap: () => Promise.resolve({ role: "Admin" }),
        });

        renderWithProviders(<Login />);

        fireEvent.input(screen.getAllByRole("textbox")[0], {
            target: { value: "admin@example.com" },
        });

        fireEvent.input(screen.getAllByRole("textbox")[1], {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });

    test("calls login and redirects user", async () => {
        mockLogin.mockReturnValue({
            unwrap: () => Promise.resolve({ role: "User" }),
        });

        renderWithProviders(<Login />);

        fireEvent.input(screen.getAllByRole("textbox")[0], {
            target: { value: "user@example.com" },
        });

        fireEvent.input(screen.getAllByRole("textbox")[1], {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/tasks");
        });
    });

    test("shows toast error on login failure", async () => {
        const { toast } = await import("sonner");

        mockLogin.mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: "Invalid credentials" } }),
        });

        renderWithProviders(<Login />);

        fireEvent.input(screen.getAllByRole("textbox")[0], {
            target: { value: "wrong@example.com" },
        });

        fireEvent.input(screen.getAllByRole("textbox")[1], {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
        });
    });
});
