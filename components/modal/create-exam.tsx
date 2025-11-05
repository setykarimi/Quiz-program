"use client";

import * as Dialog from "@radix-ui/react-dialog";

export default function AlertDialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition">
          Create an Exam
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg"
        >
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Are you absolutely sure?
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mt-2">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </Dialog.Description>

          <div className="flex justify-end gap-2 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
                Cancel
              </button>
            </Dialog.Close>

            <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
              Yes, delete it
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
