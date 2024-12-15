import { Button, Center, Text, Container, Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/UserService";
import { useState, useEffect } from "react";
import useLoggedInStore from "../stores/loggedInStore";
import { getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";

const Home = () => {
    const [userName, setUserName] = useState();
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const loggedInPlayers = useLoggedInStore((state) => state.loggedInPlayers);
    const userSocket = getNamespaceSocket("/user");
    

    console.log("Logged in playes:");
    console.log(loggedInPlayers);

    useEffect(() => {
        try {
            const fetchUser = async () => {
                const user = await getUser(user_id, token);
                setUserName(user.fullName);
                console.log("Name: ", user.fullName);
            };
            fetchUser();
        } catch (error) {
            console.log("Error:", error);
        }

        connectNamespaceSocket("/user");
        
        // Re-register the user after page refresh
        userSocket.on('connect', () => {
            if (user_id) {
                userSocket.emit('user-online', Number(user_id)); 
                console.log('Re-registered user:', user_id);
            }
        });

        const setLoggedInPlayers = useLoggedInStore.getState().setLoggedInPlayers;
        userSocket.on("updateUsersOnline", (users) => {
            console.log("Adding players: ", users)
            setLoggedInPlayers(users);
        });

        return () => {
            userSocket.off("updateOnlinePlayers");
        };

    }, []);

    const handleClick = () => {
        navigate("/game");
    };

    const handleLeaderboardClick = async () => {
        navigate("/leaderboard");
    };
    return (
        <>
            <br></br>
            <Center>
                <Box boxShadow="base" p="6" rounded="md">
                    <Box>
                        <Center>
                            <Text fontSize={32}>Welcome {userName}!</Text>
                        </Center>

                        <Box className="content-container quiz" width={400}>
                            <Text fontSize={18}>
                                Well done on logging in and creating your profile! When ready,
                                click Begin to start your journey and become a quizzard.
                            </Text>
                            <br></br>
                            <Text fontSize={18}>
                                You have 45 seconds to answer 10 questions.
                            </Text>
                            <br></br>
                            Alternatively, see your score on the Leaderboard. Stay tuned for
                            new changes soon!
                        </Box>
                        <Box>
                            <span>
                                <br></br>
                                <Container centerContent>
                                    <Text fontSize={24}>Points per correct answer</Text>
                                    <br />
                                    <ul>
                                        <li>Easy = 1 point</li>
                                        <li>Medium = 2 points</li>
                                        <li>Hard = 3 points</li>
                                    </ul>
                                </Container>
                            </span>
                        </Box>
                        <br></br>
                        <Container centerContent>
                            <Flex gap={"4"}>
                                <Button colorScheme="teal" onClick={handleClick}>
                                    Single Player
                                </Button>

                                <Button
                                    colorScheme="teal"
                                    onClick={() => {
                                        navigate("/multiplayer");
                                    }}
                                >
                                    Multiplayer Mode
                                </Button>
                            </Flex>
                            <br></br>
                            <Button onClick={handleLeaderboardClick}>Leaderboard</Button>
                        </Container>
                    </Box>
                </Box>
            </Center>
        </>
    );
};

export default Home;
