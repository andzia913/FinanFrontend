import { Container } from "@mui/material";
import NavBar from "../../components/NavBar/Navbar";
import LoginForm from "../../components/LoginForm/LoginForm";

const Login = () => {
  return (
    <Container disableGutters={true}>
      <NavBar />
      <LoginForm />
    </Container>
  );
};

export default Login;
