import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ErrorMessageProps {
  alert: { isShown: boolean; text: string };
  setAlert: Function;
}

const ErrorMessage = ({ alert, setAlert }: ErrorMessageProps) => (
  <Snackbar
    open={alert.isShown}
    autoHideDuration={3000}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    onClose={() =>
      setAlert({
        isShown: false,
        text: "",
      })
    }
  >
    <Alert severity="error">{alert.text}</Alert>
  </Snackbar>
);

export default ErrorMessage;
