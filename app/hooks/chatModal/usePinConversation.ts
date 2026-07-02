import { useChatStore } from "@/app/store/useChatStore";
import { useUpdateConversation } from "@/app/hooks/messages/useUpdateConversation";

export const usePinConversation = () => {
  const { togglePin } = useChatStore();
  const { updateConversation } = useUpdateConversation();

  const pinConversation = async (chatId: number) => {
    const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
    if (!chat) return;

    const newPinned = !chat.isPinned;
    togglePin(chatId);

    const success = await updateConversation(chatId, { isPinned: newPinned });
    if (!success) togglePin(chatId);
  };

  return { pinConversation };
};
