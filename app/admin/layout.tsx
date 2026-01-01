'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { user, loading: authLoading } = useAuth();

    const loading = adminLoading || authLoading;

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.replace('/');
        }
    }, [loading, user, isAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-duo-blue-face" size={48} />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">アクセス権限がありません</p>
            </div>
        );
    }

    return <>{children}</>;
}
