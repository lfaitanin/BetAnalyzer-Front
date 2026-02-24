import { Sidebar } from "@/components/sidebar";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background">
            <Sidebar />
            <main className="flex-1 p-2 md:p-6 pt-14 md:pt-6 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
