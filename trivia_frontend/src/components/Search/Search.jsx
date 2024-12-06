import {
    Button,
    HStack,
    Input,
    VStack,
    Card,
    Text,
    Flex,
    useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { searchPlayers } from "../../services/UserService";
import ProfileImage from "../Profile/ProfileImage";
import usePlayerStore from "../../stores/playerStore";

const Search = () => {
    const [playerName, setPlayerName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    // const [invitedPlayers, setInvitedPlayers] = useState([]); 
    const toast = useToast();

    const selectedPlayers = usePlayerStore((state) => state.selectedPlayers);
    const addPlayer = usePlayerStore((state) => state.addPlayer);
    const removePlayer = usePlayerStore((state) => state.removePlayer);
    const maxPlayers = usePlayerStore((state) => state.maxPlayers);

    const fetchSearchResults = async () => {
        const players = await searchPlayers(playerName);
        setSearchResults(players);
    };

    const handleSearch = () => {
        fetchSearchResults();
    };

    // const invitePlayer = (id) => {
    //     if (invitedPlayers.length >= 3) {
    //         toast({
    //             title: 'Multiplayer',
    //             description: 'There should be 4 players in total, including host',
    //             status: 'warning',
    //             duration: 9000,
    //             isClosable: true,
    //         });
    //         return;
    //     }

    //     // Move player from search results to invited players
    //     setSearchResults((prev) => prev.filter((player) => player.id !== id));
    //     setInvitedPlayers((prev) => [...prev, searchResults.find((player) => player.id === id)]);
    // };

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
        addPlayer(player);
        setSearchResults((prev) => prev.filter((p) => p.id !== player.id));
    };

    // const removePlayer = (id) => {
    //     // Move player from invited list back to search results
    //     setInvitedPlayers((prev) => prev.filter((player) => player.id !== id));
    //     setSearchResults((prev) => [...prev, invitedPlayers.find((player) => player.id === id)]);
    // };

    const removePlayerFromList = (id) => {
        const player = selectedPlayers.find((p) => p.id === id);
        removePlayer(id);
        setSearchResults((prev) => [...prev, player]);
    };


    return (
        <>
            {/* Search Bar */}
            <HStack width="100%" spacing={4} mb={4}>
                <Input
                    type="text"
                    placeholder="Start typing the name of a person..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <Button colorScheme={'blue'} onClick={handleSearch}>Find</Button>
            </HStack>

            {/* Columns for Search Results and Invitation List */}
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
                            // onClick={() => invitePlayer(item.id)}
                            onClick={()=> invitePlayer(item)} 
                        >
                            <HStack justifyContent="space-between" width="100%">
                                <VStack align="flex-start" spacing={0}>
                                    <Text fontWeight="bold">{item.fullName}</Text>
                                    <Text fontSize="sm">Status: Offline</Text>
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
                    {selectedPlayers.map((item) => ( //Was invitedPlayers.map((item))
                        <Card
                            key={item.id}
                            p={4}
                            border="1px solid"
                            borderColor="blue.500"
                            bg="blue.50"
                            boxShadow="md"
                            cursor="pointer"
                            // onClick={() => removePlayer(item.id)} 
                            onClick={()=> removePlayerFromList(item.id)}
                        >
                            <HStack justifyContent="space-between" width="100%">
                                <VStack align="flex-start" spacing={0}>
                                    <Text fontWeight="bold">{item.fullName}</Text>
                                    <Text fontSize="sm">Status: Offline</Text>
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
