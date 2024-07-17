import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoadingStore } from "../../state/store";

export default function LoadingBackdrop() {
  const isOpen = useLoadingStore((state) => state.isLoadingBackdropOpen);

  return (
    <div>
      <Backdrop sx={{ color: "skyblue", zIndex: 9999 }} open={isOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
