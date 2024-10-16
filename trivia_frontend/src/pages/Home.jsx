import { Button, ButtonGroup, Center, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/game");
  };
  return (
    <>
      <Box>
        <Text fontSize={32}>Welcome yound quizzard!</Text>
        <Box width={400}>
          Well done on ligging in and creating your profile! When ready, cleck
          begin to start your journey and become quizzard. Alternatively, see
          your score on the Leaderboard. Stay tuned for new changes soon!
        </Box>
        <Box>
          <Button onClick={handleClick}>Begin</Button>&nbsp;
          <Button>Leaderboard</Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
