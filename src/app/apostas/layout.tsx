import React from 'react';
import { Sidebar } from "@/components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-2 md:p-6 pt-14 md:pt-6">
        {children}
      </main>
    </div>
  );
}