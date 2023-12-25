import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import serverAddress from "../../utils/server";
import { useContext, useState } from "react";
import { redirect } from "react-router-dom";
import AuthContext from "../../Context/AuthProvider";

// const LOGIN_URL = '/auth';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  // const userRef = useRef();
  // const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //     userRef.current.focus();
  // }, [])

  // useEffect(() => {
  //     setErrMsg('');
  // }, [user, pwd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(serverAddress + "/login", {
        method: "POST",
        // mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
        // credentials: "include",
      });
      console.log(await response);
      console.log(
        "logowanie wysyłamy:",
        JSON.stringify({ email: email, password: password })
      );
      if (response.status === 200) {
        console.log("To jest odpowiedz backendu");
        const responseData = await response.json();
        console.log(JSON.stringify(responseData));
        const userMail: string = responseData.userEmail + "";
        if (setAuth) {
          setAuth({ email: userMail });
        }
        setEmail("");
        setPassword("");
        setSuccess(true);
        redirect("/");
        console.log("próbujemy wydrukować setAuth", AuthContext);
        console.log("próbujemy wydrukować setAuth", sessionStorage);
      }
    } catch (err) {
      console.error(err);
      // if (!err?.response) {
      //     setErrMsg('No Server Response');
      // } else if (err.response?.status === 400) {
      //     setErrMsg('Missing Username or Password');
      // } else if (err.response?.status === 401) {
      //     setErrMsg('Unauthorized');
      // } else {
      //     setErrMsg('Login Failed');
      // }
      // errRef.current.focus();
    }
  };

  return (
    <>
      <Container>
        {success ? (
          <Box mt={4}>
            <Typography variant="h4">You are logged in!</Typography>
            <br />
            <Link href="/">Go to Home</Link>
          </Box>
        ) : (
          <Box mt={4}>
            <Typography variant="h4">Sign In</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="useremail"
                label="Useremail"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <TextField
                type="password"
                id="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <Button variant="contained" color="primary" type="submit">
                Sign In
              </Button>
            </form>
            <Typography variant="body2">
              Need an Account?
              <br />
              <Link href="/">Sign Up</Link>
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Login;
