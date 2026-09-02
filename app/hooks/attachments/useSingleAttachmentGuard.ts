import { useCallback } from "react";

interface UseSingleAttachmentGuardOptions {
  attachmentsLength: number;
  onFileSelected: (file: File) => Promise<void>;
  onMultipleFilesSelected?: (files: File[]) => Promise<void>;
}

export function useSingleAttachmentGuard({
  attachmentsLength,
  onFileSelected,
  onMultipleFilesSelected,
}: UseSingleAttachmentGuardOptions) {
  const hasAttachment = attachmentsLength > 0;

  const guardedFileSelected = useCallback(
    async (file: File) => {
      if (hasAttachment) return;
      await onFileSelected(file);
    },
    [hasAttachment, onFileSelected],
  );

  const guardedMultipleSelected = useCallback(
    async (files: File[]) => {
      if (hasAttachment) return;
      if (!onMultipleFilesSelected) {
        if (files.length > 0) await onFileSelected(files[0]);
        return;
      }
      if (files.length > 1) return;
      await onMultipleFilesSelected(files);
    },
    [hasAttachment, onFileSelected, onMultipleFilesSelected],
  );

  return {
    guardedFileSelected,
    guardedMultipleSelected,
    hasAttachment,
  };
}
