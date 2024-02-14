import React, { useState } from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import serverAddress from "../../utils/server";
import AlertMessageProps from "types/alertMessage";

const Register = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertMessageProps["alert"]>({
    isShown: false,
    text: "",
    severity: "success",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    nameRef: React.RefObject<HTMLInputElement>,
    emailRef: React.RefObject<HTMLInputElement>,
    passwordRef: React.RefObject<HTMLInputElement>,
    passwordRepeadRef: React.RefObject<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (passwordRef.current?.value !== passwordRepeadRef.current?.value) {
      setAlert({
        isShown: true,
        text: "Wprowadzone hasła różnią się od siebie",
        severity: "error",
      });
      return;
    }
    try {
      const response = await fetch(serverAddress + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRef.current?.value,
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });
      if (response.status === 201) {
        setSuccess(true);
      } else if (response.status === 400) {
        setAlert({
          isShown: true,
          text: "Podano błędne dane. Spróbuj ponownie",
          severity: "error",
        });
      } else if (response.status === 409) {
        setAlert({
          isShown: true,
          text: "Istnieje już uzytkownik przypisany do tego adresu email",
          severity: "error",
        });
      }
    } catch (err) {
      if (!err) {
        setAlert({
          isShown: true,
          text: "Brak odpowiedzi serwera",
          severity: "error",
        });
      } else {
        setAlert({
          isShown: true,
          text: "Rejestracja nie powiodło się. Spróbuj ponownie później.",
          severity: "error",
        });
      }
    }
  };
  return (
    <Container disableGutters={true}>
      <NavBar />
      {alert.isShown && <AlertMessage alert={alert} setAlert={setAlert} />}
      {success ? (
        <Box mt={4}>
          <Typography variant="h4">Użytkownik zarejestrowany</Typography>
          <Typography>
            <Link href="/login">Zaloguj się</Link>
          </Typography>
        </Box>
      ) : (
        <RegisterForm handleSubmit={handleSubmit} />
      )}
    </Container>
  );
};

export default Register;
