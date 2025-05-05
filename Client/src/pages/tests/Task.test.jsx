import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tasks from '../Tasks';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/slices/authSlice';
import { useGetAllTaskQuery } from '../../redux/slices/api/taskApiSlice';

// Mock child components


vi.mock('../../components/Loader', () => ({
    default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock('../../components/Title', () => ({
    default: ({ title }) => <div data-testid="title">{title}</div>,
}));
vi.mock('../../components/Button', () => ({
    default: ({ onClick, label }) => (
        <button data-testid="create-task-button" onClick={onClick}>
            {label}
        </button>
    ),
}));
vi.mock('../../components/Tabs', () => ({
    default: ({ children, setSelected }) => (
        <div>
            <button data-testid="board-view" onClick={() => setSelected(0)}>Board View</button>
            <button data-testid="list-view" onClick={() => setSelected(1)}>List View</button>
            <div>{children}</div>
        </div>
    ),
}));
vi.mock('../../components/TaskTitle', () => ({
    default: ({ label }) => <div data-testid="task-title">{label}</div>,
}));
vi.mock('../../components/BoardView', () => ({
    default: ({ tasks }) => <div data-testid="board-view-tasks">{tasks?.length ?? 0} tasks</div>,
}));
vi.mock('../../components/task/Table', () => ({
    default: ({ tasks }) => <div data-testid="table-tasks">{tasks?.length ?? 0} tasks</div>,
}));
vi.mock('../../components/task/AddTask', () => ({
    default: ({ open }) => (open ? <div data-testid="add-task-modal">Add Task Modal</div> : null),
}));

// Mock API hook
// Mock API hooks
vi.mock('../../redux/slices/api/taskApiSlice', () => ({
    useGetAllTaskQuery: vi.fn(() => ({
        data: { tasks: [{ id: 1, title: 'Test Task' }] },
        isLoading: false,
    })),
    useCreateTaskMutation: () => [
        vi.fn(), // This is the mutation function (e.g., createTask)
        { isLoading: false }, // Mutation state
    ],
}));


// Helper to render with Redux + Router
const renderWithProviders = (ui, { initialState = {} } = {}) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: initialState.auth || { user: { role: 'admin' } } },
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </Provider>
    );
};

describe('Tasks page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading initially if loading is true', () => {
        useGetAllTaskQuery.mockReturnValueOnce({ isLoading: true });
    
        renderWithProviders(<Tasks />);
        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('renders title and create button', () => {
        renderWithProviders(<Tasks />);

        expect(screen.getByTestId('title')).toBeInTheDocument();
        expect(screen.getByTestId('create-task-button')).toBeInTheDocument();
    });

    it('opens AddTask modal when Create Task button is clicked', () => {
        renderWithProviders(<Tasks />);

        expect(screen.queryByTestId('add-task-modal')).not.toBeInTheDocument();

        const button = screen.getByTestId('create-task-button');
        fireEvent.click(button);

        expect(screen.getByTestId('add-task-modal')).toBeInTheDocument();
    });

    it('renders BoardView by default', () => {
        renderWithProviders(<Tasks />);

        expect(screen.getByTestId('board-view-tasks')).toBeInTheDocument();
    });

    it('renders Table when List View is selected', () => {
        renderWithProviders(<Tasks />);

        const listViewButton = screen.getByTestId('list-view');
        fireEvent.click(listViewButton);

        expect(screen.getByTestId('table-tasks')).toBeInTheDocument();
    });

    it('does not render Create Task button for role=user', () => {
        renderWithProviders(<Tasks />, {
            initialState: {
                auth: { user: { role: 'user' } },
            },
        });

        expect(screen.queryByTestId('create-task-button')).not.toBeInTheDocument();
    });
});
