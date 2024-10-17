import { Container, Flex, Text, Image } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react'
import Logo from "../assets/images/quizzard_octupus_logo.png"

const Login = ()=> {
    return (
        <>
        <Flex alignContent={"center"} justifyContent={"center"} alignItems={"center"} height={"90vh"}>
        <Container centerContent>
            <Card>
                <CardHeader>
                    <Container>
                    <Image src={Logo} height={"50px"} width={"45px"}></Image>
                    <Text fontSize={32}>Quizzard</Text>
                    </Container>
                </CardHeader>
                <CardBody>
                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' />
                    <FormLabel>Password</FormLabel>
                    <Input type='password' />
                    <Button
                        mt={4}
                        colorScheme='teal'
                        type='submit'
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