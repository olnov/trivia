import { Card, CardHeader, CardBody, CardFooter, Flex, Stack, Container, Text, Image, Link, Box } from '@chakra-ui/react'
import { FormControl, FormLabel, FormHelperText, FormErrorMessage, Input, Button } from '@chakra-ui/react'

import { useState } from 'react'
import { signUp, login } from '../services/UserService'
import { useNavigate } from 'react-router-dom'
import Logo from "../assets/images/octopus-logo.png"
import "./Style.css";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            if (!isPasswordValid) {
                return setError("Password doesn't meet the password policy requirements");
            }
            if (password === confirmPassword) {
                await signUp(fullName, email, password);
                const data = await login(email, password);
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                navigate("/home");
            } else {
                setError("Passwords don't match");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred";
            setError(errorMessage);
            console.log("Error: ", errorMessage);
        }
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!#$%^&*+=\-\[\]\\';,/{}|\\":<>?])(?=.{8,})/;
        setIsPasswordValid(regex.test(password));
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    return (
        <div className="background">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
                <Container centerContent>
                    <Card textAlign={"-webkit-center;"} width={"350px"}>
                        <CardHeader>
                            <Container>
                                <Image src={Logo} height={"60px"} width={"60px"}></Image>
                                <Text fontSize={32}>Quizzard</Text>
                                <Text>Sign up</Text>
                            </Container>
                        </CardHeader>
                        <CardBody>
                            <FormControl>
                                <FormLabel htmlFor='fullName'>Full name</FormLabel>
                                <Input
                                    variant="outline"
                                    type="text"
                                    value={fullName}
                                    name='fullName'
                                    id='fullName'
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    name='email'
                                    id='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <FormLabel htmlFor='password'>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    name='password'
                                    id='password'
                                    // onChange={(e) => setPassword(e.target.value)}
                                    onChange={handlePasswordChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                                {isFocused && (
                                    <FormHelperText textAlign={'justify'}>
                                        <Text fontSize='xs'>
                                            At least one uppercase letter, one lowercase letter,
                                            and at least one special character.
                                            Minimum 8 characters long.
                                        </Text>
                                    </FormHelperText>
                                )}
                                <FormLabel htmlFor='confirmPassword'>Confirm password</FormLabel>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {error ? (
                                    <Stack>
                                        <Text as='b' color='tomato'>{error}</Text>
                                    </Stack>
                                ) : (
                                    <Stack></Stack>
                                )}
                                <Button mt={4} type="onSubmit" colorScheme='teal' onClick={handleSignUp}>Signup</Button>
                            </FormControl>
                            <Link href="/login">
                                <Text align={"center"} fontSize={"xs"}>
                                    Already registred? Please login.
                                </Text>
                            </Link>
                        </CardBody>
                    </Card>
                </Container>
            </Flex>
        </div>
    );

}

export default Signup;