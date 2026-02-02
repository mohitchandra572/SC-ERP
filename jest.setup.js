// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            pathname: '/',
            query: {},
            asPath: '/',
        };
    },
    usePathname() {
        return '/';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Mock Next.js server actions
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => ({
            ...init,
            json: async () => data,
        })),
        redirect: jest.fn(),
        next: jest.fn(),
    },
}));

// Suppress console errors in tests (optional)
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
