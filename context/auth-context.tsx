"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: any;
  role: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 👇 سشن فعلی رو از Supabase بگیر
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const session = data.session;

        if (session?.user) {
          setUser(session.user);
          setRole(session.user.app_metadata?.role ?? null);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.warn("Error reading Supabase session:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 👇 وقتی لاگین یا لاگ‌اوت شد، وضعیت رو آپدیت کن
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setRole(session?.user?.app_metadata?.role ?? null);

      if (!session) {
        router.replace("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
