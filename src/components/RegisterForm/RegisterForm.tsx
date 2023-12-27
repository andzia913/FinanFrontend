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
import { useState, useEffect } from "react";
import serverAddress from "../../utils/server";

type RegisterProps = {};

const Register: React.FC<RegisterProps> = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<string>("");
  const [matchPassword, setMatchPassword] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [alert, setAlert] = useState({ isShown: false, text: "" });

  useEffect(() => {
    setValidPassword(password);
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setAlert({ isShown: true, text: "Podano niewłaściwe dane" });
      return;
    }

    try {
      const response = await fetch(serverAddress + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.status === 201) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setMatchPassword("");
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
              type="text"
              label="Imię"
              id="username"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              fullWidth
              margin="normal"
            />

            <TextField
              type="email"
              label="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              id="password"
              label="hasło"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              fullWidth
              margin="normal"
            />

            <TextField
              type="password"
              id="confirm_pwd"
              label="Powtórz hasło"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              fullWidth
              margin="normal"
              error={!validMatch}
            />

            <Button
              type="submit"
              disabled={!name || !validPassword || !validMatch}
            >
              Zarejestruj się
            </Button>
          </Box>
          <Typography>Masz już konto?</Typography>
          <Link href="/login">Zaloguj się</Link>
        </Box>
      )}
    </Container>
  );
};

export default Register;
