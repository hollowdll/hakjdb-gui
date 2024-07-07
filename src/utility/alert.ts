import { useAlertBoxStore } from "../state/store";

export const errorAlert = (message: string) => {
  const openAlert = useAlertBoxStore.getState().open;
  const setAlertContent = useAlertBoxStore.getState().setContent;
  setAlertContent(message, "error");
  openAlert();
};

export const successAlert = (message: string) => {
  const openAlert = useAlertBoxStore.getState().open;
  const setAlertContent = useAlertBoxStore.getState().setContent;
  setAlertContent(message, "success");
  openAlert();
};
