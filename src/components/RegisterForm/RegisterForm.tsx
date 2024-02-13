import {
  Typography,
  Link,
  Button,
  Snackbar,
  Alert,
  Box,
  TextField,
  Container,
} from "@mui/material";
import { useState, useRef } from "react";
import serverAddress from "../../utils/server";

type RegisterProps = {};

const Register: React.FC<RegisterProps> = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordRepeadRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [alert, setAlert] = useState({ isShown: false, text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current?.value !== passwordRepeadRef.current?.value) {
      setAlert({
        isShown: true,
        text: "Wprowadzone hasła różnią się od siebie",
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
        });
      } else if (response.status === 409) {
        setAlert({
          isShown: true,
          text: "Istnieje już uzytkownik przypisany do tego adresu email",
        });
      }
    } catch (err) {
      if (!err) {
        setAlert({ isShown: true, text: "Brak odpowiedzi servera" });
      } else {
        setAlert({
          isShown: true,
          text: "Rejstracja nie powiodło się. Spróbuj ponownie później.",
        });
      }
    }
  };

  return (
    <Container maxWidth="xs">
      {alert && (
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
      )}
      {success ? (
        <Box mt={4}>
          <Typography variant="h4">Użytkownik zarejestrowany</Typography>
          <Typography>
            <Link href="/login">Zaloguj się</Link>
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          mt={4}
        >
          <Typography variant="h4">Rejestracja</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              inputRef={nameRef}
              type="text"
              label="Imię"
              id="username"
              autoComplete="off"
              required
              fullWidth
              margin="normal"
            />

            <TextField
              inputRef={emailRef}
              type="email"
              label="email"
              id="email"
              autoComplete="off"
              required
              fullWidth
              margin="normal"
            />
            <TextField
              inputRef={passwordRef}
              type="password"
              id="password"
              label="hasło"
              required
              fullWidth
              margin="normal"
            />

            <TextField
              inputRef={passwordRepeadRef}
              type="password"
              id="confirm_pwd"
              label="Powtórz hasło"
              required
              fullWidth
              margin="normal"
            />

            <Button type="submit">Zarejestruj się</Button>
          </Box>
          <Typography>Masz już konto?</Typography>
          <Link href="/login">Zaloguj się</Link>
        </Box>
      )}
    </Container>
  );
};

export default Register;
