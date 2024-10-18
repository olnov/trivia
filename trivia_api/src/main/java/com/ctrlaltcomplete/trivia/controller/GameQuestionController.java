package com.ctrlaltcomplete.trivia.controller;

import com.ctrlaltcomplete.trivia.dto.AnswersDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class GameQuestionController {

    @PostMapping("/games")
    public String saveResult(@RequestBody AnswersDto answers) {
        System.out.println(answers.getQuestion_id());
        System.out.println(answers.getPlayer_id());
        System.out.println(answers.getTrivia_id());
        System.out.println(answers.getPlayers_answer());
        System.out.println(answers.getCorrect_answer());
        System.out.println(answers.getIs_correct());
        System.out.println(answers.getDifficulty());
        System.out.println(answers.getScore());
        System.out.println(answers.getAnswered_at());
        return "OK";
    }

    @GetMapping("/topscores")
    public ResponseEntity<Map<String, Map<String,String>>> scoreBoard() {
        Map<String, Map<String, String>> response = new HashMap<>();
        Map<String,String> player1 = new HashMap<>();
        player1.put("name","John");
        player1.put("score","1000");
        Map<String, String> player2 = new HashMap<>();
        player2.put("name","George");
        player2.put("score","2000");

        response.put("1",player1);
        response.put("2", player2);

        return ResponseEntity.ok(response);
    }


}
