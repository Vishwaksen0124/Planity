import '@testing-library/jest-dom';

beforeAll(() => {
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => {
                store[key] = String(value);
            },
            removeItem: (key) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };
    })();

    Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
    });

    localStorage.setItem('userInfo', JSON.stringify({ role: 'Admin' }));
});
