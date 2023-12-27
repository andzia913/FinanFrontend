import { Check, Close, Info } from "@mui/icons-material";
import {
  Paper,
  Typography,
  Link,
  InputLabel,
  Input,
  FormHelperText,
  FormControl,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import serverAddress from "../../utils/server";

type RegisterProps = {};

const Register: React.FC<RegisterProps> = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validName, setValidName] = useState<string>("");
  const [validPassword, setValidPassword] = useState<string>("");
  const [matchPassword, setMatchPassword] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setValidName(name);
  }, [name]);

  useEffect(() => {
    setValidPassword(password);
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await fetch(serverAddress + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        // credentials: "include",
      });
      console.log(response, "odpowiedz serwera na wysłane dane");
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setMatchPassword("");
      redirect("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper>
      {success ? (
        <section>
          <Typography variant="h4">Success!</Typography>
          <Typography>
            <Link href="/">Sign In</Link>
          </Typography>
        </section>
      ) : (
        <section>
          <Typography
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </Typography>
          <Typography variant="h4">Register</Typography>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <InputLabel htmlFor="username">
                Imię:
                <Check className={validName ? "valid" : "hide"} />
                <Close className={validName || !name ? "hide" : "invalid"} />
              </InputLabel>
              <Input
                type="text"
                id="username"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                aria-invalid={validName ? "false" : "true"}
              />
              <FormHelperText
                id="uidnote"
                className={name && !validName ? "instructions" : "offscreen"}
              >
                <Info />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="email">Email:</InputLabel>
              <Input
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="password">
                Password:
                <Check className={validPassword ? "valid" : "hide"} />
                <Close
                  className={validPassword || !password ? "hide" : "invalid"}
                />
              </InputLabel>
              <Input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                aria-invalid={validPassword ? "false" : "true"}
              />
              <FormHelperText
                id="pwdnote"
                className={
                  password && !validPassword ? "instructions" : "offscreen"
                }
              >
                <Info />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="confirm_pwd">
                Confirm Password:
                <Check
                  className={validMatch && matchPassword ? "valid" : "hide"}
                />
                <Close
                  className={validMatch || !matchPassword ? "hide" : "invalid"}
                />
              </InputLabel>
              <Input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                required
                aria-invalid={validMatch ? "false" : "true"}
              />
              <FormHelperText
                id="confirmnote"
                className={
                  matchPassword && !validMatch ? "instructions" : "offscreen"
                }
              >
                <Info />
                Must match the first password input field.
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              disabled={!validName || !validPassword || !validMatch}
            >
              Sign Up
            </Button>
          </form>
          <Typography>
            Already registered?
            <br />
            <span className="line">
              <Link href="/">Sign In</Link>
            </span>
          </Typography>
        </section>
      )}
    </Paper>
  );
};

export default Register;
