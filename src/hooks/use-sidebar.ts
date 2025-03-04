// @/hooks/use-sidebar.ts
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOpen,
  setIsOpen,
  setIsHover,
  setSettings,
  selectSidebar,
  selectSidebarOpenState,
} from "@/redux/states/sidebarSlice";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const sidebarState = useSelector(selectSidebar);
  const isOpen = useSelector(selectSidebarOpenState);

  return {
    ...sidebarState,
    isOpen,
    toggleOpen: () => dispatch(toggleOpen()),
    setIsOpen: (isOpen: boolean) => dispatch(setIsOpen(isOpen)),
    setIsHover: (isHover: boolean) => dispatch(setIsHover(isHover)),
    setSettings: (settings: Partial<typeof sidebarState.settings>) =>
      dispatch(setSettings(settings)),
  };
};
