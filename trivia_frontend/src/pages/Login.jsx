import { Container, Flex, Text, Image } from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Stack,
} from "@chakra-ui/react";
import Logo from "../assets/images/octopus-logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, login, isAuthenticated } from "../services/UserService";
import socket, {getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";
import useLoggedInStore from "../stores/loggedInStore";
import "./Style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const currentGameRoom = localStorage.getItem("currentGameRoom");
  const gameStatus = localStorage.getItem("gameStatus");
  const userSocket = getNamespaceSocket("/user");
  

  const storageCheck = async () => {
    if (userId && token && isAuthenticated()) {
      return navigate("/home");
    }
    if (userId && token && currentGameRoom && gameStatus && gameStatus == "waiting" && isAuthenticated()) {
      const user = await getUser(userId, token);
      setUserName(user.fullName);
      socket.emit("joinRoom", { playerName: userName, roomCode: currentGameRoom });  
      navigate("/multiplayer");
    }
  };

  useEffect(() => {
    // connectUserSocket();
    connectNamespaceSocket("/user");
    storageCheck();
  },[currentGameRoom, gameStatus, userId, token, navigate]);

  const getLoggedIn = async (e) => {
    e.preventDefault();
    try {
      const addLoggedInPlayer = useLoggedInStore.getState().addLoggedInPlayer;
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      userSocket.emit("user-online", data.userId);
      userSocket.on("updateUsersOnline", (users) => {
        addLoggedInPlayer(users);
        console.log("[From login] Online users:", users);
      });
      navigate("/home");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      console.log("Error: ", errorMessage);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  return (
    <>
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
        <Flex
          alignContent={"center"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"90vh"}
        >
          <Container centerContent>
            <Card textAlign={"-webkit-center;"} width={"350px"}>
              <CardHeader>
                <Container>
                  <Image src={Logo} height={"60px"} width={"60px"}></Image>
                  <Text fontSize={32}>Quizzard</Text>
                  <Text>Login</Text>
                </Container>
              </CardHeader>
              <CardBody>
                <FormControl>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    type="email"
                    name={"email"}
                    id={"email"}
                    value={email}
                    onChange={handleChange}
                  />
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    type="password"
                    name={"password"}
                    id={"password"}
                    value={password}
                    onChange={handleChange}
                  />
                  {error ? (
                    <Stack>
                      <Text as="b" color="tomato">
                        {error}
                      </Text>
                    </Stack>
                  ) : (
                    <Stack></Stack>
                  )}
                  <Button
                    mt={4}
                    colorScheme="teal"
                    type="submit"
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
      </div>
    </>
  );
};

export default Login;
