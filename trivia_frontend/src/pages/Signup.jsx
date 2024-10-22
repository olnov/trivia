import { Card, CardHeader, CardBody, CardFooter, Flex, Stack, Container, Text, Image, Link, Box } from '@chakra-ui/react'
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react'

import { useState } from 'react'
import { signUp, login } from '../services/UserService'
import { useNavigate } from 'react-router-dom'
import Logo from "../assets/images/quizzard_octupus_logo.png"

const Signup = ()=> {
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [error, setError]=useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false)

    const navigate = useNavigate();

    const handleSignUp = async(e)=> {
        e.preventDefault();
        try{
            if (!isPasswordValid) {
                return setError("Password doesn't meet the password policy requirements");
            }
            if (password === confirmPassword) {
                await signUp(fullName,email,password);
                const data = await login(email,password);
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                navigate("/home");
            } else {
                setError("Passwords don't match");
            }
        }catch(err){
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
        <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
            <Container centerContent>
            <Card textAlign={"-webkit-center;"} width={"350px"}>
                <CardHeader>
                    <Container>
                    <Image src={Logo} height={"50px"} width={"45px"}></Image>
                    <Text fontSize={32}>Quizzard</Text>
                    <Text>Sign up</Text>
                    </Container>
                </CardHeader>
                <CardBody>
                <FormControl>
                    <FormLabel>Full name</FormLabel>
                    <Input
                        variant="outline"
                        type="text"
                        value={fullName}
                        name='fullName'
                        id='fullName'
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <FormLabel>Email</FormLabel>
                    <Input 
                        type="email"
                        value={email}
                        name='email'
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        name='password'
                        id='password'
                        // onChange={(e) => setPassword(e.target.value)}
                        onChange={handlePasswordChange}
                        required
                    />
                    <FormLabel>Confirm password</FormLabel>
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
                    ):(
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
            <Container centerContent>
                Password policy.
                <br></br>
                The password should contain at least one uppercase letter, at least one lowercase letter,
                and at least one special character.
                <br></br>
                The password should be at least 8 characters long.
            </Container>
            </Flex>
        );

}

export default Signup;