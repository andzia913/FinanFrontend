import React, { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import serverAddress from "../../utils/server";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState({ isShown: false, text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
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
        setAlert({ isShown: true, text: "Błędny login lub hasło" });
      }
    } catch (err) {
      if (!err) {
        setAlert({ isShown: true, text: "Brak odpowiedzi servera" });
      } else {
        setAlert({
          isShown: true,
          text: "Logowanie nie powiodło się. Spróbuj ponownie później.",
        });
      }
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        {alert.isShown && (
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
            <Typography variant="h4">Zostałeś zalogowany!</Typography>
            <br />
            <Link href="/">Na stonę główną</Link>
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
            <Typography variant="h4">Logowanie</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                inputRef={emailRef}
                id="useremail"
                label="Email"
                autoComplete="off"
                required
                fullWidth
                margin="normal"
              />

              <TextField
                inputRef={passwordRef}
                type="password"
                id="password"
                label="Hasło"
                required
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Zaloguj
              </Button>
            </Box>
            <Typography variant="body2" margin={1}>
              Jeżeli nie masz konta, możesz się zarejestrować
            </Typography>
            <Link href="/register">Zarejstruj się</Link>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Login;
