"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("exams").select("*");

      if (error) {
        console.error(error);
      } else {
        setExams(data || []);
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in</div>;


  return <div>
hi
  </div>;
}
