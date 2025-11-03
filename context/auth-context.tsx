"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AuthContextType = {
  user: any;
  role: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0];
      const key = `sb-${projectRef}-auth-token`;

      const stored = localStorage.getItem(key);
      if (stored) {
        const session = JSON.parse(stored);

        if (session?.user) {
          setUser(session.user);
          setRole(session.user.app_metadata?.role ?? null);
        }
      }
    } catch (err) {
      console.warn("Error reading supabase auth from localStorage:", err);
    }

    // const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setUser(session?.user ?? null);
    //   setRole(session?.user?.app_metadata?.role ?? null);
    // });

    // return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
