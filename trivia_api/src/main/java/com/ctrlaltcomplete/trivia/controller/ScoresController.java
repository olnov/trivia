package com.ctrlaltcomplete.trivia.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScoresController {

    @RequestMapping(value = "/topscores", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public String topScores () {
        return "{\"user1\":10, \"user2\":20, \"user3\":15, \"user4\":25, \"user5\":30}";
    }

}
