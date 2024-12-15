import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/images/octopus-logo.png";
import { getUser } from "../services/UserService";
import ProfileImage from "../components/Profile/ProfileImage";
import useLoggedInStore from "../stores/loggedInStore";
import { getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";
import useMessageStore from "../stores/messageStore";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
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

const NavLink = ({ children }) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Nav() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    // userSocket.on("updateUsersOnline", (users) => {
    //   console.log("[From logout] Online users:", users);
    // });
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
        console.log("Response received:", message);
        addMessages([message]);
      };

      userSocket.on("messaging", handleResponse);
    }
  }, [user_id, storedMessages]);

  const handleClearMessages = () => {
    clearMessages();
    localStorage.removeItem("message-store");
  };

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
                    {storedMessages[storedMessages.length - 1] || "No new notifications"}
                  </PopoverBody>
                  <PopoverFooter>
                  <Button colorScheme="blue" size="sm" onClick={handleClearMessages}>
                    Clear
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
