import React from 'react';
import { Container } from '@mui/material';
import NavBar from '../../components/NavBar/Navbar';
import RegisterForm from '../../components/RegisterForm/RegisterForm';

const Register = () => {
  return (
    <Container disableGutters={true}>
      <NavBar/>
      <RegisterForm/>
    </Container>
  );
};

export default Register;
