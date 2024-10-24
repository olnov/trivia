import { Box, Button, Text, Card, CardBody, Center } from "@chakra-ui/react";
import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScores } from "../services/ScoreService";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardState, setLeaderboardState] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const token = localStorage.getItem("token");

  const fetchLeaderboard = async () => {
    try {
      const data = await getScores(token);
      const leaderboardArray = data;
      setLeaderboardState(leaderboardArray);
      console.log("Array is: ", JSON.stringify(leaderboardArray));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error} </Text>
      ) : (
        <>
          <Center>
            <Box w='50%' p={4} textAlign={"center"}>
              <Text textAlign={"center"} fontSize={"xl"}>Quizzard Top 10</Text>
              <TableContainer>
                <Table variant='striped' colorScheme='blue' size='sm'>
                  <Tbody>
                    {leaderboardState.map((item) => (
                      <Tr key={item.userId}>
                        <Td>{item.fullName}</Td>
                        <Td>{item.totalScore}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <br></br>
              <Button onClick={() => navigate("/home")}>Home</Button>
            </Box>
          </Center>
        </>
      )}
    </>
  );

};

export default Leaderboard;
