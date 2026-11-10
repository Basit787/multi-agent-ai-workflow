import type { AuthUser } from '../types/auth.types.js';

export function toAuthUser(user: {
  id: string | number;
  email: string;
  role?: string | null;
}): AuthUser {
  return {
    id: Number(user.id),
    email: user.email,
    role: user.role === 'admin' ? 'admin' : 'user',
  };
}
