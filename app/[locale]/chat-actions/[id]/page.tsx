"use client";

import { useRouter } from "next/navigation";
import ChatActionsModal from "../../dashboard/chatEdit/ChatActionsModal";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ChatActionsPage({ params }: PageProps) {
  const router = useRouter();
  const chatId = parseInt(params.id);

  const handleClose = () => {
    router.back();
  };

  const handleAction = (actionName: string) => {
    console.log(`${actionName} action triggered for chat ${chatId}`);
    // FUTURE: Implement actual logic here
    alert(`${actionName} functionality coming soon!`);
    handleClose();
  };

  return (
    <ChatActionsModal
      isOpen={true}
      onClose={handleClose}
      chatId={chatId}
      onShare={() => handleAction("Share")}
      onRename={() => handleAction("Rename")}
      onPin={() => handleAction("Pin")}
      onDelete={() => handleAction("Delete")}
    />
  );
}
