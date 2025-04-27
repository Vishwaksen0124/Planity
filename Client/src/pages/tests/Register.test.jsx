// Register.test.jsx

// 1. Mock react-router-dom first
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
import Register from "../Register";

// 3. Mock components
vi.mock("../../components/Textbox", () => ({
    default: ({ label, register, errors }) => (
        <div data-testid="textbox">
            <label>{label}</label>
            <input {...register} />
            {errors && <span>{errors}</span>}
        </div>
    ),
}));

vi.mock("../../components/SelectBox", () => ({
    default: ({ label, register, options, errors }) => (
        <div data-testid="selectbox">
            <label>{label}</label>
            <select {...register}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
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
const mockRegister = vi.fn();
vi.mock("../../redux/slices/api/authApiSlice", () => ({
    useRegisterMutation: () => [mockRegister, { isLoading: false }],
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn() },
}));

// 5. Helper function
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
describe("Register Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders register form", () => {
        renderWithProviders(<Register />);

        expect(screen.getByText(/Register now/i)).toBeInTheDocument();
        expect(screen.getByText(/Hustle now for a better Tommorow/i)).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });

    test("shows error when submitting empty form", async () => {
        renderWithProviders(<Register />);

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
        });
    });

    test("successful register redirects to login", async () => {
        mockRegister.mockReturnValue({
            unwrap: () => Promise.resolve({ token: "mock-token" }),
        });

        renderWithProviders(<Register />);

        const inputs = screen.getAllByRole("textbox");
        fireEvent.input(inputs[0], { target: { value: "Test User" } }); // Username
        fireEvent.input(inputs[1], { target: { value: "test@example.com" } }); // Email
        fireEvent.input(inputs[2], { target: { value: "password123" } }); // Password
        fireEvent.input(inputs[3], { target: { value: "Developer" } }); // Title
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "user" } }); // Role

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/log-in");
        });
    });

    test("shows toast error on register failure", async () => {
        const { toast } = await import("sonner");

        mockRegister.mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: "Registration failed" } }),
        });

        renderWithProviders(<Register />);

        const inputs = screen.getAllByRole("textbox");
        fireEvent.input(inputs[0], { target: { value: "Test User" } }); // Username
        fireEvent.input(inputs[1], { target: { value: "test@example.com" } }); // Email
        fireEvent.input(inputs[2], { target: { value: "password123" } }); // Password
        fireEvent.input(inputs[3], { target: { value: "Developer" } }); // Title
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "user" } }); // Role

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Registration failed");
        });
    });

});
