import { Container, Flex, Text, Image } from '@chakra-ui/react'
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { FormControl, FormLabel, Input, Button, Link, Stack } from '@chakra-ui/react'
import Logo from "../assets/images/quizzard_octupus_logo.png"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { login } from '../services/UserService';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const getLoggedIn = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            navigate("/home");
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred";
            setError(errorMessage);
            console.log("Error: ", errorMessage);
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    };


    return (
        <>
            <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
                <Container centerContent>
                    <Card textAlign={"-webkit-center;"} width={"350px"}>
                        <CardHeader>
                            <Container>
                                <Image src={Logo} height={"50px"} width={"45px"}></Image>
                                <Text fontSize={32}>Quizzard</Text>
                                <Text>Login</Text>
                            </Container>
                        </CardHeader>
                        <CardBody>
                            <FormControl>
                                <FormLabel>Email address</FormLabel>
                                <Input type='email' name={'email'} id={'email'} value={email} onChange={handleChange} />
                                <FormLabel>Password</FormLabel>
                                <Input type='password' name={'password'} id={'password'} value={password} onChange={handleChange} />
                                {error ? (
                                    <Stack>
                                        <Text as='b' color='tomato'>{error}</Text>
                                    </Stack>
                                ) : (
                                    <Stack></Stack>
                                )}
                                <Button
                                    mt={4}
                                    colorScheme='teal'
                                    type='submit'
                                    onClick={getLoggedIn}
                                >
                                    Login
                                </Button>
                            </FormControl>
                            <Link href="/signup">
                                <Text align={"center"} fontSize={"xs"}>
                                    Don't have an account? Please register.
                                </Text>
                            </Link>
                        </CardBody>
                    </Card>
                </Container>
            </Flex>
        </>
    )
}

export default Login;