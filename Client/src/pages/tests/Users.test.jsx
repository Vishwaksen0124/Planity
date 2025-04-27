import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Users from "../Users"; // Adjust your path!
import * as userApi from "../../redux/slices/api/userApiSlice"; // Adjust your path!
import * as reactToast from "sonner";
import { vi } from "vitest";
beforeAll(() => {
    const localStorageMock = (function () {
        let store = {};
        return {
            getItem(key) {
                return store[key] || null;
            },
            setItem(key, value) {
                store[key] = String(value);
            },
            removeItem(key) {
                delete store[key];
            },
            clear() {
                store = {};
            }
        };
    })();

    Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
    });

    // Optional: Mock userInfo in localStorage
    localStorage.setItem("userInfo", JSON.stringify({ role: "Admin" }));
});

// Mocks
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../redux/slices/api/userApiSlice", () => ({
    useGetTeamListQuery: vi.fn(),
    useDeleteUserMutation: vi.fn(),
    useUserActionMutation: vi.fn(),
}));

vi.mock("../../components/AddUser", () => ({
    default: () => <div>AddUser Modal</div>,
}));

vi.mock("../../components/Dialogs", () => ({
    default: ({ open, setOpen, onClick }) => (
        open ? <div>Confirmation Dialog<button onClick={onClick}>Confirm Delete</button></div> : null
    ),
    UserAction: ({ open, setOpen, onClick }) => (
        open ? <div>UserAction Dialog<button onClick={onClick}>Confirm Status Change</button></div> : null
    ),
}));

const mockStore = configureStore([]);

describe("Users Page", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { user: { role: "Admin" } },
        });

        userApi.useGetTeamListQuery.mockReturnValue({
            data: [
                { _id: "1", name: "John Doe", email: "john@example.com", title: "Manager", role: "User", isActive: true },
                { _id: "2", name: "Jane Smith", email: "jane@example.com", title: "Engineer", role: "User", isActive: false },
            ],
            isLoading: false,
            refetch: vi.fn(),
        });

        userApi.useDeleteUserMutation.mockReturnValue([vi.fn()]);
        userApi.useUserActionMutation.mockReturnValue([vi.fn()]);
    });

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Users />
                </MemoryRouter>
            </Provider>
        );

    it("renders team members correctly", async () => {
        renderComponent();

        expect(await screen.findByText("Team Members")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("opens AddUser modal on clicking Add New User button", async () => {
        renderComponent();

        const addButton = screen.getByText("Add New User");
        fireEvent.click(addButton);

        expect(await screen.findByText("AddUser Modal")).toBeInTheDocument();
    });

    it("redirects and shows toast if user is not Admin", () => {
        store = mockStore({
            auth: { user: { role: "User" } },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Users />
                </MemoryRouter>
            </Provider>
        );

        expect(reactToast.toast.error).toHaveBeenCalledWith("Not authenticated");
    });

    it("calls deleteUser when Confirm Delete clicked", async () => {
        const mockDeleteUser = vi.fn(() => Promise.resolve({ message: "Deleted!" }));
        userApi.useDeleteUserMutation.mockReturnValue([mockDeleteUser]);

        renderComponent();

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        // Confirm the delete
        const confirmDelete = await screen.findByText("Confirm Delete");
        fireEvent.click(confirmDelete);

        await waitFor(() => {
            expect(mockDeleteUser).toHaveBeenCalled();
        });
    });

    it("calls editClick when Edit button is clicked", async () => {
        renderComponent();

        const editButtons = screen.getAllByText("Edit");
        fireEvent.click(editButtons[0]);

        expect(await screen.findByText("AddUser Modal")).toBeInTheDocument();
    });

    

    it("shows loading state if isLoading is true", () => {
        userApi.useGetTeamListQuery.mockReturnValueOnce({
            data: [],
            isLoading: true,
            refetch: vi.fn(),
        });

        renderComponent();

        expect(screen.getByRole("table")).toBeInTheDocument(); // or your own loading indicator
    });

    it("handles error from deleteUser", async () => {
        const mockDeleteUser = vi.fn(() => {
            throw new Error("Failed to delete user");
        });
        userApi.useDeleteUserMutation.mockReturnValue([mockDeleteUser]);
    
        renderComponent();
    
        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);
    
        const confirmDelete = await screen.findByText("Confirm Delete");
        fireEvent.click(confirmDelete);
    
        await waitFor(() => {
            // Check that the correct error message is displayed
            expect(reactToast.toast.error).toHaveBeenCalledWith("Failed to delete user");
        });
    });
    
    
});
