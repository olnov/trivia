import { Button, ButtonGroup, Center, Text } from "@chakra-ui/react";
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
    <Box>
      <Box>
        <Button onClick={handleClick}>Begin</Button>
        <Button>Leaderboard</Button>
        <Text fontSize={32}>Welcome young quizzard!</Text>
        <Box width={400}>
          Well done on logging in and creating your profile! When ready, click
          Begin to start your journey and become a quizzard. Alternatively, see
          your score on the Leaderboard. Stay tuned for new changes soon!
        </Box>
        <Box>
          <span>
            <br></br>
            <Text fontSize={24}>Points per answer</Text>
            <ul>
              <li>Easy = 1 point</li>
              <li>Medium = 2 points</li>
              <li>Hard = 3 points</li>
            </ul>
          </span>
        </Box>
        <Box>
          <Button onClick={handleClick}>Begin</Button>&nbsp;
          <Button onClick={handleLeaderboardClick}>Leaderboard</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
