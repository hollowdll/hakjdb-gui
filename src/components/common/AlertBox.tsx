import { Alert, Snackbar } from "@mui/material";
import { useAlertBoxStore } from "../../state/store";

export type AlertSeverity = "success" | "error";

export default function AlertBox() {
  const handleClose = useAlertBoxStore((state) => state.close);
  const { isOpen, message, severity } = useAlertBoxStore((state) => ({
    isOpen: state.isOpen,
    message: state.message,
    severity: state.severity,
  }));

  return (
    <>
      <Snackbar
        open={isOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          maxWidth: "400px",
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", wordBreak: "break-word" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
