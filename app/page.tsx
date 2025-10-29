"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("data", data)
      setUser(data?.session?.user ?? null);
    };
    getUser();
  }, []);

  if (!user) return <div>Please log in</div>;

  return <div>Welcome, {user?.email}</div>;
}
