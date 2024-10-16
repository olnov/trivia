import { Button, ButtonGroup, Center, Text } from '@chakra-ui/react'
import { Box } from "@chakra-ui/react"


const Home = ()=> {
    return (
        <>
        <Box>
        <Text fontSize={32}>Welcome yound quizzard!</Text>
            <Box width={400}>
                Well done on ligging in and creating your profile!
                When ready, cleck begin to start your journey and become quizzard.
                Alternatively, see your score on the Leaderboard.
                Stay tuned for new changes soon!
            </Box>
            <Box>
                <Button>Begin</Button>&nbsp;
                <Button>Leaderboard</Button>
            </Box>
        </Box>
        </>
    )
}

export default Home;