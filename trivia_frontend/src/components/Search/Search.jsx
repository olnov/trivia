import {
    Button,
    HStack,
    Input,
    VStack,
    Card,
    Text,
    Flex,
    useToast,
    Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { searchPlayers } from "../../services/UserService";
import ProfileImage from "../Profile/ProfileImage";
import usePlayerStore from "../../stores/playerStore";
import useLoggedInStore from "../../stores/loggedInStore";


const Search = () => {
    const [playerName, setPlayerName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const user_id = localStorage.getItem("userId");
    const toast = useToast();

    const selectedPlayers = usePlayerStore((state) => state.selectedPlayers);
    const addPlayer = usePlayerStore((state) => state.addPlayer);
    const removePlayer = usePlayerStore((state) => state.removePlayer);
    const maxPlayers = usePlayerStore((state) => state.maxPlayers);
    const loggedInPlayers = useLoggedInStore((state) => state.loggedInPlayers);
    

    const fetchSearchResults = async () => {
        const players = await searchPlayers(playerName);
        setSearchResults(players);
    };

    const handleSearch = () => {
        fetchSearchResults();
    };

    const invitePlayer = (player) => {
        if (selectedPlayers.length >= maxPlayers) {
            toast({
                title: 'Multiplayer',
                description: 'There should be 4 players in total, including host',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        if (selectedPlayers.find((p) => p.id === player.id)) {
            toast({
                title: 'Multiplayer',
                description: 'Player already invited',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        if (player.id === Number(user_id)) {
            toast({
                title: 'Multiplayer',
                description: 'You can not add host as a player',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        if (!loggedInPlayers.includes(player.id)) {
            toast({
                title: 'Multiplayer',
                description: 'Player is offline. Please invite online players only.',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        addPlayer(player);
        setSearchResults((prev) => prev.filter((p) => p.id !== player.id));
    };


    const removePlayerFromList = (id) => {
        const player = selectedPlayers.find((p) => p.id === id);
        removePlayer(id);
        setSearchResults((prev) => [...prev, player]);
    };


    return (
        <>
            <HStack width="100%" spacing={4} mb={4}>
                <Input
                    type="text"
                    placeholder="Start typing the name of a person..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <Button colorScheme={'blue'} onClick={handleSearch}>Find</Button>
            </HStack>
            <Flex width="100%" gap={4}>
                {/* Search Results Column */}
                <VStack width={'50%'} align={'stretch'}>
                    <Text fontSize={'sm'} as={'b'}>Search results</Text>
                    <VStack
                        width="100%"
                        align="stretch"
                        spacing={4}
                        border="1px solid"
                        borderColor="gray.200"
                        p={4}
                        borderRadius="md"
                        height={'200px'}
                        overflowY={'auto'}
                    >
                        {searchResults.map((item) => (
                            <Card
                                key={item.id}
                                p={4}
                                border="1px solid"
                                borderColor="gray.200"
                                bg="white"
                                boxShadow="md"
                                cursor="pointer"
                                onClick={() => invitePlayer(item)}
                            >
                                <HStack justifyContent="space-between" width="100%">
                                    <VStack align="flex-start" spacing={0}>
                                        <Text fontWeight="bold">{item.fullName}</Text>
                                        <Text fontSize="sm">
                                            Status:{" "}
                                            {loggedInPlayers.includes(item.id) ? (
                                                <Badge colorScheme="green">Online</Badge>
                                            ) : (
                                                <Badge>Offline</Badge>
                                            )}
                                        </Text>
                                    </VStack>
                                    <ProfileImage userId={item.id} size="sm" />
                                </HStack>
                            </Card>
                        ))}
                    </VStack>
                    <Text fontSize={'sm'}>
                        Players found: {searchResults.length}
                    </Text>
                </VStack>

                {/* Invitation List Column */}
                <VStack width={'50%'} align={'stretch'}>
                    <Text fontSize={'sm'} as={'b'}>
                        Invitation List
                    </Text>
                    <VStack
                        width="100%"
                        align="stretch"
                        spacing={4}
                        border="1px solid"
                        borderColor="gray.200"
                        p={4}
                        borderRadius="md"
                        height={'200px'}
                        overflowY={'auto'}
                    >
                        {selectedPlayers.map((item) => (
                            <Card
                                key={item.id}
                                p={4}
                                border="1px solid"
                                borderColor="blue.500"
                                bg="blue.50"
                                boxShadow="md"
                                cursor="pointer"
                                onClick={() => removePlayerFromList(item.id)}
                            >
                                <HStack justifyContent="space-between" width="100%">
                                    <VStack align="flex-start" spacing={0}>
                                        <Text fontWeight="bold">{item.fullName}</Text>
                                        <Text fontSize="sm">
                                            Status:{" "}
                                            {loggedInPlayers.includes(item.id) ? (
                                                <Badge colorScheme="green">Online</Badge>
                                            ) : (
                                                <Badge>Offline</Badge>
                                            )}
                                        </Text>
                                    </VStack>
                                    <ProfileImage userId={item.id} size="sm" />
                                </HStack>
                            </Card>
                        ))}
                    </VStack>
                    <Text fontSize={'sm'}>
                        Players to invite: {selectedPlayers.length}
                    </Text>
                </VStack>
            </Flex>
        </>
    );
};

export default Search;
