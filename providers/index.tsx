"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode, useState } from "react";
import { SettingProvider } from "@/context/setting-context";

export default function Providers({ children }: { children: ReactNode }) {
  // ✅ ساختن QueryClient فقط یکبار در سمت کلاینت
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingProvider>
          {children}
        </SettingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
