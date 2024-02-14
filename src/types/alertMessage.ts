export default interface AlertMessageProps {
  setAlert: Function;
  alert: {
    isShown: boolean;
    text: string;
    severity: "error" | "success" | "info" | "warning";
  };
}
