import { Card, CardHeader, CardBody, CardFooter, Flex, Stack } from '@chakra-ui/react'
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react'

import { useState, useEffect } from 'react'
import { signUp } from '../services/UserService'

const Signup = ()=> {
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSignUp = (e)=> {
        e.preventDefault();
        try{
            console.log("hey");
            const data = signUp(fullName,email,password);
        }catch(error){
            console.log("Error: ", error)
        }
//         }finally(() => { console.log("finally")})
    }
    return (
        <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
            <Card>
                <CardHeader fontSize={32}>Signup</CardHeader>
                <CardBody>
                <form onSubmit={handleSignUp}>
                    <Stack>
                    <input
                        variant="outline"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    </Stack>
                    <Stack>
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </Stack>
                    <Stack>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </Stack>
                    <Stack>
                    <Button mt={4} type="onSubmit" colorScheme='teal'>Signup</Button>
                    </Stack>
                </form>
                </CardBody>
            </Card>
            </Flex>
        );

}

export default Signup;