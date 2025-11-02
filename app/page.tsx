"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
    const {data} = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
  };

  getUser();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in</div>;

  return <div>Welcome, {user?.email}</div>;
}
