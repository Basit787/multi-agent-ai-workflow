import type { Request } from 'express';

export type Role = 'user' | 'admin';
export type AuthUser = { id: number; email: string; role: Role };
export type AuthRequest = Request & { user: AuthUser };
