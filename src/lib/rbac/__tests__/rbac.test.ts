import { hasPermission } from '../rbac';
import type { Session } from 'next-auth';

describe('RBAC - hasPermission', () => {
    const mockAdminSession: Session = {
        user: {
            id: '1',
            email: 'admin@test.com',
            name: 'Admin User',
            permissions: ['create:user', 'edit:user', 'delete:user', 'view:analytics'],
        } as any,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const mockTeacherSession: Session = {
        user: {
            id: '2',
            email: 'teacher@test.com',
            name: 'Teacher User',
            permissions: ['view:students', 'edit:attendance', 'edit:grades'],
        } as any,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    describe('Permission Checking', () => {
        it('should return true when user has the required permission', () => {
            expect(hasPermission(mockAdminSession, 'create:user')).toBe(true);
            expect(hasPermission(mockAdminSession, 'edit:user')).toBe(true);
            expect(hasPermission(mockTeacherSession, 'view:students')).toBe(true);
        });

        it('should return false when user does not have the required permission', () => {
            expect(hasPermission(mockTeacherSession, 'create:user')).toBe(false);
            expect(hasPermission(mockTeacherSession, 'delete:user')).toBe(false);
            expect(hasPermission(mockAdminSession, 'nonexistent:permission')).toBe(false);
        });

        it('should return false for null session', () => {
            expect(hasPermission(null, 'create:user')).toBe(false);
        });

        it('should return false for session without permissions', () => {
            const sessionWithoutPerms: Session = {
                user: {
                    id: '3',
                    email: 'noperms@test.com',
                    name: 'No Permissions User',
                } as any,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            expect(hasPermission(sessionWithoutPerms, 'create:user')).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty permission string', () => {
            expect(hasPermission(mockAdminSession, '')).toBe(false);
        });

        it('should be case-sensitive for permission slugs', () => {
            expect(hasPermission(mockAdminSession, 'CREATE:USER')).toBe(false);
            expect(hasPermission(mockAdminSession, 'create:user')).toBe(true);
        });

        it('should handle session without user object', () => {
            const invalidSession = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            } as Session;

            expect(hasPermission(invalidSession, 'create:user')).toBe(false);
        });
    });
});
