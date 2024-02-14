import { Box, Container, Link, Typography } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useState } from "react";
import serverAddress from "../../utils/server";
import ErrorMessage from "../../components/AlertMessage/AlertMessage";
import AlertMessage from "../../types/alertMessage";

const Login = () => {
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<AlertMessage["alert"]>({
    isShown: false,
    text: "",
    severity: "success",
  });

  const handleSubmit = async (
    e: React.FormEvent,
    emailRef: React.RefObject<HTMLInputElement>,
    passwordRef: React.RefObject<HTMLInputElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(serverAddress + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
        localStorage.setItem("accessToken", accessToken);

        setSuccess(true);
      } else if (response.status === 401 || response.status === 400) {
        setAlert({
          isShown: true,
          text: "Błędny login lub hasło",
          severity: "success",
        });
      }
    } catch (err) {
      if (!err) {
        setAlert({
          isShown: true,
          text: "Brak odpowiedzi servera",
          severity: "success",
        });
      } else {
        setAlert({
          isShown: true,
          text: "Logowanie nie powiodło się. Spróbuj ponownie później.",
          severity: "success",
        });
      }
    }
  };
  return (
    <Container disableGutters={true}>
      <NavBar />
      <Container maxWidth="xs">
        {alert.isShown && <ErrorMessage alert={alert} setAlert={setAlert} />}
        {success ? (
          <Box mt={4}>
            <Typography variant="h4">Zostałeś zalogowany!</Typography>
            <br />
            <Link href="/">Na stonę główną</Link>
          </Box>
        ) : (
          <LoginForm handleSubmit={handleSubmit} />
        )}
      </Container>
    </Container>
  );
};

export default Login;
