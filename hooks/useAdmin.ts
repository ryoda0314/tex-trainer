'use client';

import { useAuth } from './useAuth';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export function useAdmin() {
    const { user, loading } = useAuth();

    const isAdmin = user?.email
        ? ADMIN_EMAILS.includes(user.email.toLowerCase())
        : false;

    return { isAdmin, loading };
}
