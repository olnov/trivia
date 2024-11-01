import { Button } from "@chakra-ui/react";
import { client } from "../services/SocketService";

const Competititon = ()=> {
    
    const handleClient = ()=> {
        try {
        client();
        }catch(error){
            console.error("Error: ", error);
        }
    }

    return (
        <>
        <h1>WebSocket Test</h1>
        <Button onClick={handleClient}>Test Client</Button>
        </>
    )
}

export default Competititon;