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

const Search = () => {
    const [playerName, setPlayerName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const toast = useToast();

    const fetchSearchResults = async () => {
        const players = await searchPlayers(playerName);
        setSearchResults(players);
    };

    const handleSearch = () => {
        fetchSearchResults();
    };

    const toggleCardSelection = (id) => {
        setSelectedCards((prevSelected) => {
            const isSelected = prevSelected.includes(id);
            const newSelected = isSelected
                ? prevSelected.filter((cardId) => cardId !== id) // Deselect
                : [...prevSelected, id]; // Select

            if (newSelected.length > 4) {
                toast({
                    title: 'Multiplayer',
                    description: 'You can add only 4 players to the game',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });

                return prevSelected; // Do not add more than 4 players
            }

            return newSelected;
        });
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
                <Button onClick={handleSearch}>Find</Button>
            </HStack>
            <Flex
                wrap="wrap"
                gap={4}
                justifyContent="flex-start"
                alignItems="flex-start"
                width="100%"
            >
                {searchResults.map((item) => (
                    <Card
                        key={item.id}
                        p={4}
                        width="250px"
                        border="1px solid"
                        borderColor={selectedCards.includes(item.id) ? "blue.500" : "gray.200"}
                        bg={selectedCards.includes(item.id) ? "blue.50" : "white"}
                        boxShadow={selectedCards.includes(item.id) ? "lg" : "md"}
                        cursor="pointer"
                        onClick={() => toggleCardSelection(item.id)} // Toggle selection on click
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
            </Flex>
        </>
    );
};

export default Search;
