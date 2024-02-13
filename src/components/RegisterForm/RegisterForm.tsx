import { useRef } from "react";
import {
  Typography,
  Link,
  Button,
  Box,
  TextField,
  Container,
} from "@mui/material";

type RegisterProps = { handleSubmit: Function };

const Register: React.FC<RegisterProps> = ({ handleSubmit }: RegisterProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordRepeadRef = useRef<HTMLInputElement>(null);

  return (
    <Container maxWidth="xs">
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
        <Box
          component="form"
          onSubmit={(e) =>
            handleSubmit(e, nameRef, emailRef, passwordRef, passwordRepeadRef)
          }
        >
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
    </Container>
  );
};

export default Register;
