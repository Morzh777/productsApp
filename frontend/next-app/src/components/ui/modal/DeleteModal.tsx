"use client";

import type { DeleteConfirmModalProps } from "@/types/components/DeleteConfirmModal.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export function DeleteConfirmModal({
  product,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-60">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
            Подтверждение удаления
          </DialogTitle>
          
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить товар <strong>&ldquo;{product?.title}&rdquo;</strong>? 
            Это действие нельзя отменить.
          </p>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="cancel"
              className="flex-1"
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              variant="delete"
              className="flex-1"
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
