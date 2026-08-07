import useModalStore from "./modalStore";
import { useSidebarStore } from "./useSidebarStore";

export function resetDashboardUi() {
  useModalStore.getState().closeAll();
  useSidebarStore.setState({ isOpen: false, autoFocusSearch: false });
}