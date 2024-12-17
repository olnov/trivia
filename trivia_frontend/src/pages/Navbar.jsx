import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/images/octopus-logo.png";
import { getUser } from "../services/UserService";
import ProfileImage from "../components/Profile/ProfileImage";
import useLoggedInStore from "../stores/loggedInStore";
import { getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";
import useMessageStore from "../stores/messageStore";
import socket from "../services/SocketService";


import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";


export default function Nav() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  
  const { colorMode, toggleColorMode } = useColorMode();
  const [hostId, setHostId] = useState(null);

  const user_id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const removeLoggedInPlayer = useLoggedInStore((state) => state.removeLoggedInPlayer);
  const storedMessages = useMessageStore((state) => state.storedMessages);
  const addMessages = useMessageStore((state) => state.addMessages);
  const clearMessages = useMessageStore((state) => state.clearMessages);
  const userSocket = getNamespaceSocket("/user");

  const handleProfileView = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    const userSocket = getNamespaceSocket("/user");
    removeLoggedInPlayer(user_id);
    userSocket.emit("user-offline", user_id);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("currentGameRoom");
    localStorage.removeItem("gameStatus");
    localStorage.removeItem("logged-in-players");
    localStorage.removeItem("difficulty");
    localStorage.removeItem("message-store");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(user_id, token);
        setUsername(userData.fullName);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    connectNamespaceSocket("/user");
    if (userSocket) {
      const handleResponse = (message) => {
        // console.log("Response received:", message);
        addMessages([message]);
      };

      userSocket.on("messaging", handleResponse);

      if (storedMessages.length > 0) {
        setHostId(storedMessages[storedMessages.length - 1].user_id);
      }
    }
  }, [user_id, storedMessages, setHostId]);

  const handleClearMessages = () => {
    clearMessages();
    localStorage.removeItem("message-store");
  };

  const handleJoinGame = (roomCode) => {
    // console.log("Joining game...");
    userSocket.emit("generic-messaging", {message:`Invitation has been accepted by ${username}`, status:"accepted", userId: Number(user_id) }, Number(hostId));
    socket.emit("joinRoom", { playerName: username, roomCode: roomCode });
    clearMessages();
    navigate("/multiplayer");
  }

  const handleDecline = () => {
    userSocket.emit("generic-messaging", {message:`Invitation has been declined by ${username}`, status:"declined", userId: Number(user_id) }, Number(hostId));
    clearMessages();
  }

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <img
              src={Logo}
              style={{ width: "60px", cursor: "pointer" }}
              onClick={() => navigate("/home")}
              alt="logo"
            />
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {/* <Button>
                <BellIcon />
              </Button> */}
              <Box position="relative" display="inline-block">
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<BellIcon />}
                      aria-label="Notifications"
                      variant="ghost"
                      size="lg"
                    />
                  </PopoverTrigger>
                  {storedMessages.length > 0 && (
                    <Box
                      position="absolute"
                      top="4px"
                      right="4px"
                      width="10px"
                      height="10px"
                      bg="red.500"
                      borderRadius="full"
                      border="2px solid"
                      borderColor="white"
                    />
                  )}
                  <PopoverContent>
                    <PopoverHeader fontWeight="semibold">Notifications</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      {storedMessages.length > 0 ? (
                        <>
                          {/* {setHostId(storedMessages[storedMessages.length - 1].user_id)} */}
                          <Text>You are invited to play a game by </Text>
                          <Text>{storedMessages[storedMessages.length - 1].userName}</Text>
                          <Button colorScheme="green" onClick={() => handleJoinGame(storedMessages[storedMessages.length - 1].roomCode)}>
                            Accept
                          </Button>
                          &nbsp;
                          <Button colorScheme="red" onClick={handleDecline}>
                            Decline
                          </Button>
                        </>
                      ) : (
                        "No new notifications"
                      )}
                    </PopoverBody>
                    <PopoverFooter>
                      <Button colorScheme="blue" size="sm" onClick={handleClearMessages}>
                        Clear all messages
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Box>
              <Button data-testid="dark-mode" onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <ProfileImage userId={user_id} size={"sm"} />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <ProfileImage userId={user_id} size={"2xl"} />
                  </Center>
                  <br />
                  <Center>
                    <p>{username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {/* <MenuItem>My Games</MenuItem> */}
                  <MenuItem onClick={handleProfileView}>My Profile</MenuItem>
                  <MenuItem data-testid="Logout-button" onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
