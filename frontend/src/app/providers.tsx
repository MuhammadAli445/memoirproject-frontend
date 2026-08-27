"use client";

import { MemoryProvider } from "@/context/MemoryContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MemoryProvider>{children}</MemoryProvider>;
}
