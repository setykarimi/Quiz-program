"use client";

import { UserDetailsModal } from "@/components";
import { useAdminUsers } from "@/hooks";
import { More } from "iconsax-reactjs";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";

export default function AdminsTable() {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data:users, isLoading, isError, error } = useAdminUsers();

  if (isLoading)
    return <div className="text-gray-500 text-center my-10 animate-pulse">Loading admins...</div>;

  if (isError)
    return <div className="text-red-500 text-center my-10">Error: {error.message}</div>;

  const handleShowDetails = (id:string) => {
    setOpen(true)
    setSelectedId(id)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-100">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">#</th>
              <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Name</th>
              <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Email</th>
              <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Role</th>
              <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any, index: number) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{user.user_metadata.display_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.app_metadata.role}</td>
                <td className="px-4 py-3">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 outline-0">
                        <More size={20} className="w-5 h-5 text-gray-600"/>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-40 bg-white rounded-md shadow-lg border border-gray-100 p-1 text-sm"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item
                          onClick={() => handleShowDetails(user.id)}
                          className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer outline-0"
                        >
                          🔍 View Details
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserDetailsModal id={selectedId} open={open} setOpen={setOpen}/>
    </>
  );
}
