'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm font-medium">Verificando sessão...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Middleware handles redirect, this is a fallback
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background">
            <Sidebar />
            <main className="flex-1 p-2 md:p-6 pt-14 md:pt-6 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
