import React from 'react';
// eslint-disable-next-line
import { Container } from '@mui/material';
import NavBar from '../../components/NavBar/Navbar';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';

const Main = () => {
  // eslint-disable-next-line no-console
  console.log('x');
  return (
    <Container disableGutters={true}>
      <NavBar/>
      <Login></Login>
      <Register></Register>
    </Container>
  );
};

export default Main;
