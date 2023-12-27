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
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
        localStorage.setItem("accessToken", accessToken);

        setEmail("");
        setPassword("");
        setSuccess(true);
      } else if (response.status === 400) {
        setAlert({ isShown: true, text: "Błędny login lub hasło" });
      }
    } catch (err) {
      if (!err) {
        setAlert({ isShown: true, text: "Brak odpowiedzi servera" });
      } else {
        setAlert({
          isShown: true,
          text: "Logowanie nie powiodło się. Spróbuj ponownie.",
        });
      }
    }
  };

  return (
    <>
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
                id="useremail"
                label="Useremail"
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
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
              Jeżei nie masz konta, możesz się zarejestrować
              <br />
              <Link href="/register">Zarejstruj się</Link>
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Login;
