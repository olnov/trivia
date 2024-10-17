import { Container, Flex, Text, Image } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react'
import Logo from "../assets/images/quizzard_octupus_logo.png"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { login } from '../services/UserService';

const Login = ()=> {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();

    const getLoggedIn = async(e)=> {
        e.preventDefault();
        try {
            const data = await login(email,password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            console.log("Token:", data.token);
            console.log("User id:", data.userId);
            console.log("Data:", data);
            navigate("/home");
        }catch(error){
            console.log("Error:", error);
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "email") {
          setEmail(e.target.value);
        } else if (e.target.name === "password") {
          setPassword(e.target.value);
        }
      };


    // useEffect(()=>{
    //     getLoggedIn();
    // },[]);

    return (
        <>
        <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
        <Container centerContent>
            <Card textAlign={"-webkit-center;"}>
                <CardHeader>
                    <Container>
                    <Image src={Logo} height={"50px"} width={"45px"}></Image>
                    <Text fontSize={32}>Quizzard</Text>
                    </Container>
                </CardHeader>
                <CardBody>
                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' name={'email'} id={'email'} value={email} onChange={handleChange}/>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' name={'password'} id={'password'} value={password} onChange={handleChange}/>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        type='submit'
                        onClick={getLoggedIn}
                    >
                        Login
                    </Button>
                    </FormControl>
                </CardBody>
            </Card>
        </Container>
        </Flex>
        </>
    )
}

export default Login;