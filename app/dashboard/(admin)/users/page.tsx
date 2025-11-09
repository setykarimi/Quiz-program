"use client";

import { useAdminUsers } from "@/hooks";

export default function AdminsTable() {
  const { data:users, isLoading, isError, error } = useAdminUsers();

  if (isLoading)
    return <div className="text-gray-500 text-center my-10 animate-pulse">Loading admins...</div>;

  if (isError)
    return <div className="text-red-500 text-center my-10">Error: {error.message}</div>;

  console.log("data", users?.users?.users)

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-100">
      <table className="min-w-full bg-white text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((admin: any, index: number) => (
            <tr key={admin.id} className="border-t">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{admin.user_metadata.display_name}</td>
              <td className="px-4 py-3">{admin.email}</td>
              <td className="px-4 py-3">{admin.app_metadata.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
