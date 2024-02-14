import { Snackbar, Alert } from "@mui/material";
import AlertMessageProps from "../../types/alertMessage";

const AlertMessage = ({ alert, setAlert }: AlertMessageProps) => (
  <Snackbar
    open={alert.isShown}
    autoHideDuration={3000}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    onClose={() =>
      setAlert({
        isShown: false,
        text: "",
        severity: "success",
      })
    }
  >
    <Alert severity="error">{alert.text}</Alert>
  </Snackbar>
);

export default AlertMessage;
