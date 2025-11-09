"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FC } from "react";

type ConfirmDeleteDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
};

export const DeleteConfirmDialog: FC<ConfirmDeleteDialogProps> = ({ open, setOpen, onConfirm }) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold text-gray-800">
            Are you sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-gray-600 text-sm">
            This action cannot be undone. Do you really want to delete this item?
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition border-0">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
