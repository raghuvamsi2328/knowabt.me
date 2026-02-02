'use client';

import { useEffect, useState } from 'react';

export interface User {
    id: number;
    github_id: string;
    username: string;
    email: string | null;
    avatar_url: string | null;
    created_at: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';

    const checkAuth = async () => {
        try {
            const response = await fetch(`${MANAGER_URL}/auth/user`, {
                credentials: 'include'
            });
            const data = await response.json();
            setUser(data.user || null);
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${MANAGER_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { user, loading, logout, checkAuth };
}
