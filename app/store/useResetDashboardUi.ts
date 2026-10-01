import useModalStore from "./modalStore";
import { useSidebarStore } from "./useSidebarStore";
import { useChatStore } from "./useChatStore";

export function resetDashboardUi() {
  useModalStore.getState().closeAll();
  useSidebarStore.setState({ isOpen: false, autoFocusSearch: false });
  useChatStore.setState({ activeConversationId: null, messages: [] });
}