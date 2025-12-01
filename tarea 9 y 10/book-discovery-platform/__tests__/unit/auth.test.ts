import { describe, it, expect, vi } from 'vitest';
import User from '../../src/models/User';
import { encrypt, decrypt } from '../../src/lib/session';
import bcrypt from 'bcrypt';

// Mock mongoose model methods if necessary, but for unit tests we might test logic directly
// However, User model methods rely on mongoose schema. 
// Let's test the bcrypt logic and session logic independently first.

describe('Authentication Unit Tests', () => {

    describe('Session Management', () => {
        it('should encrypt and decrypt a session payload correctly', async () => {
            const payload = { userId: '12345', expiresAt: new Date() };
            const token = await encrypt(payload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decrypted = await decrypt(token);
            expect(decrypted).toBeDefined();
            expect(decrypted?.userId).toBe(payload.userId);
        });

        it('should return null for invalid session token', async () => {
            const decrypted = await decrypt('invalid-token');
            expect(decrypted).toBeNull();
        });
    });

    describe('Password Hashing (Integration with bcrypt)', () => {
        it('should hash a password correctly', async () => {
            const password = 'mysecretpassword';
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            expect(hash).not.toBe(password);
            const match = await bcrypt.compare(password, hash);
            expect(match).toBe(true);
        });
    });
});
