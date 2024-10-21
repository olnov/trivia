import { Button, ButtonGroup, Center, Text, Container } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
    <Box boxShadow='base' p='6' rounded='md'>
        <Box>
        <Text fontSize={32} centerContent>Welcome young quizzard!</Text>
        <Box width={400}>
          Well done on logging in and creating your profile! When ready, click
          Begin to start your journey and become a quizzard. Alternatively, see
          your score on the Leaderboard. Stay tuned for new changes soon!
        </Box>
        <Box>
          <span>
            <br></br>
            <Container centerContent>
            <Text fontSize={24} centerContent>Points per answer</Text>
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
          <Button onClick={handleClick}>Begin</Button>
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
