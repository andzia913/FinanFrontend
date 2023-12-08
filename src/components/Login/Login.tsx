import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../../Context/AuthProvider";
import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';

// const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    // const userRef = useRef();
    // const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            const response = await fetch('http://localhost:5000/login',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password}),
                credentials: 'include',
              })
              console.log('logowanie wysyłamy:', email, password)

            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const token = response.json
            // const roles = response?.data?.roles;
            if(setAuth){
                setAuth({ email, token });
            }
            setEmail('');
            setPassword('');
            setSuccess(true);
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
    }

    return (
        <>
        <Container>
            {success ? (
                <Box mt={4}>
                    <Typography variant="h4">You are logged in!</Typography>
                    <br />
                    <Link href="#">Go to Home</Link>
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
                        <Button variant="contained" color="primary" type="submit">Sign In</Button>
                    </form>
                    <Typography variant="body2">
                        Need an Account?<br />
                        <Link href="/">Sign Up</Link>
                    </Typography>
                </Box>
            )}
        </Container>
        </>
    )
}

export default Login