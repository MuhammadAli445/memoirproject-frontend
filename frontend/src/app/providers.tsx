"use client";

import { MemoryProvider } from "@/context/MemoryContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MemoryProvider>{children}</MemoryProvider>
    </AuthProvider>
  );
}
