"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // ✅ ساختن QueryClient فقط یکبار در سمت کلاینت
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
