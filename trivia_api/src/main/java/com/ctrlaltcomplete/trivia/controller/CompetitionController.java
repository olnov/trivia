package com.ctrlaltcomplete.trivia.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CompetitionController {
    private static final Logger logger = LoggerFactory.getLogger(CompetitionController.class);

    @MessageMapping("/play")
    @SendTo("/topic/game")
    public String handlePlayMessage(String message) {
        logger.info("Received message: {}", message);
        return "Server received: " + message;
    }
}