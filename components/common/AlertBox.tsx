'use client'

import { Alert, Snackbar } from "@mui/material";
import { AlertColor, AlertPropsColorOverrides } from "@mui/material";
import OverridableStringUnion from "@mui/types"

type AlertBoxProps = {
  message: string,
  severity: OverridableStringUnion.OverridableStringUnion<AlertColor, AlertPropsColorOverrides>,
  open: boolean,
  handleClose: () => void,
}

export default function AlertBox({message, severity, open, handleClose}: AlertBoxProps) {
  return (
    <>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}