import { logger, measurePerformance } from '../logger';

// Mock console methods
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Log Levels', () => {
        it('should log info messages', () => {
            logger.info('Test info message', { key: 'value' });
            expect(console.log).toHaveBeenCalled();
        });

        it('should log warning messages', () => {
            logger.warn('Test warning message');
            expect(console.warn).toHaveBeenCalled();
        });

        it('should log error messages', () => {
            const testError = new Error('Test error');
            logger.error('Test error message', testError);
            expect(console.error).toHaveBeenCalled();
        });

        it('should log debug messages', () => {
            logger.debug('Test debug message');
            expect(console.debug).toHaveBeenCalled();
        });
    });

    describe('Error Logging', () => {
        it('should include error details in log', () => {
            const testError = new Error('Test error');
            testError.stack = 'Error stack trace';

            logger.error('Error occurred', testError, { context: 'test' });

            expect(console.error).toHaveBeenCalled();
            const logCall = (console.error as jest.Mock).mock.calls[0][0];
            expect(logCall).toContain('Error occurred');
        });

        it('should handle non-Error objects', () => {
            logger.error('Custom error', { customError: 'details' });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('HTTP Logging', () => {
        it('should log HTTP requests with correct level', () => {
            logger.http('GET', '/api/test', 200, 150);
            expect(console.log).toHaveBeenCalled();
        });

        it('should log 4xx as warnings', () => {
            logger.http('GET', '/api/test', 404, 50);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should log 5xx as errors', () => {
            logger.http('GET', '/api/test', 500, 100);
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('Performance Logging', () => {
        it('should log fast operations as debug', () => {
            logger.performance('Fast operation', 500);
            expect(console.debug).toHaveBeenCalled();
        });

        it('should log slow operations as warnings', () => {
            logger.performance('Slow operation', 1500);
            expect(console.warn).toHaveBeenCalled();
        });
    });
});

describe('measurePerformance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should measure and log execution time', async () => {
        const mockFn = jest.fn(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return 'result';
        });

        const result = await measurePerformance('test-operation', mockFn);

        expect(result).toBe('result');
        expect(mockFn).toHaveBeenCalled();
    });

    it('should handle errors and still log performance', async () => {
        const mockFn = jest.fn(async () => {
            throw new Error('Test error');
        });

        await expect(measurePerformance('failing-operation', mockFn)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalled();
    });
});
