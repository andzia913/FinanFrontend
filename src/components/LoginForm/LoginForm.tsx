import React, { useRef } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";

interface LoginProps {
  handleSubmit: Function;
}

const Login = ({ handleSubmit }: LoginProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <>
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
        <Box
          component="form"
          onSubmit={(e) => handleSubmit(e, emailRef, passwordRef)}
        >
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
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Zaloguj
          </Button>
        </Box>
        <Typography variant="body2" margin={1}>
          Jeżeli nie masz konta, możesz się zarejestrować
        </Typography>
        <Link href="/register">Zarejstruj się</Link>
      </Box>
    </>
  );
};

export default Login;
