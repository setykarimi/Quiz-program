import { useQuery } from "@tanstack/react-query";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/auth/get-users")
      if (!res.ok) throw new Error("Failed to fetch admins");
      return res.json();
    },
  });
}