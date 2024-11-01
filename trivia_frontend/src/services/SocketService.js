import { Client } from '@stomp/stompjs';

export const client = () => {
    const stompClient = new Client({
        brokerURL: 'ws://localhost:8080/game', // WebSocket endpoint
        reconnectDelay: 5000, // Automatically reconnect every 5 seconds if connection is lost
        onConnect: (frame) => {
            console.log('Connected: ' + frame);

            // Subscribe to the game topic to receive updates
            stompClient.subscribe('/topic/game', (message) => {
                console.log('Received message: ' + message.body);
            });

            // Send a message to the server
            stompClient.publish({
                destination: '/app/play',
                body: 'Player move data'
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    // Activate the STOMP client connection
    stompClient.activate();
};
