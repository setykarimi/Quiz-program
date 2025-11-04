"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/auth-context";

export default function ExamsPage() {
  const { user, loading } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      fetchExams();
    }
  }, [user, loading]);

  const fetchExams = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("exams")
      .select(`*`)

    if (error) console.error("❌ Error fetching exams:", error);
    else setExams(data || []);
    setIsLoading(false);
  };

  if (loading || isLoading) return <p>Loading exams...</p>;

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">My Exams</h1>
      {exams.length ? (
        <ul className="space-y-2">
          {exams.map((item) => (
            <li key={item.id} className="p-3 bg-white shadow rounded-lg">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No exams assigned.</p>
      )}
    </div>
  );
}
