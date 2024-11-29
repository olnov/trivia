import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getUser, updateUserProfile } from "../services/UserService";
import ProfileImage from "../components/Profile/ProfileImage";
import FileUploadDialog from "../components/Profile/FileUploadDialog";

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileVersion, setProfileVersion] = useState(0);

  const user_id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();


  const handleProfileHide = () => {
    navigate("/home");
  };

  const handleProfileUpdate = async()=>{
    try {
      await updateUserProfile(user_id, token, username, password);
      setProfileVersion(profileVersion + 1);
      toast({
        title: 'User profile',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
    })
    } catch(error) {
      console.error("Error updating profile: ", error)
      toast({
        title: 'User profile',
        description: 'Error updating profile',
        status: 'error',
        duration: 9000,
        isClosable: true,
    })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(user_id, token);
        setUsername(userData.fullName);
        setEmail(userData.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user_id, profileVersion]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Profile Edit
        </Heading>
        <FormControl id="userIcon">
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <ProfileImage userId={user_id} size={"xl"} />
            </Center>
            <Center w="full">
              <Button w="full" onClick = {onOpen}>Change profile image</Button>
              {isOpen && <FileUploadDialog userId = {user_id} isOpen = {isOpen} onClose = {onClose} />} 
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName">
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address (read only)</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            disabled
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
        <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleProfileUpdate}
          >
            Save
          </Button>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={handleProfileHide}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
