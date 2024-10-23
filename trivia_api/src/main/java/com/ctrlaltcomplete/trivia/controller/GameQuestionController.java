package com.ctrlaltcomplete.trivia.controller;

import com.ctrlaltcomplete.trivia.dto.AnswersDto;
import com.ctrlaltcomplete.trivia.dto.AuthRequest;
import com.ctrlaltcomplete.trivia.dto.ScoresDto;
import com.ctrlaltcomplete.trivia.model.GameQuestion;
import com.ctrlaltcomplete.trivia.model.User;
import com.ctrlaltcomplete.trivia.repository.GameQuestionRepository;
import com.ctrlaltcomplete.trivia.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.PageRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class GameQuestionController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    GameQuestionRepository gameQuestionRepository;

    @PostMapping("/topscores/new")
    public ResponseEntity<String> submitScores(@RequestBody List<AnswersDto> playerAnswers) {
        for (AnswersDto dto : playerAnswers) {
            GameQuestion gameQuestion = new GameQuestion();

            // Find user by player_id (which may be session ID or user ID)
            User user = userRepository.findById(dto.getPlayer_id()).orElseThrow(() -> new RuntimeException("User not found"));

            gameQuestion.setUser(user);
            gameQuestion.setAnswer(dto.getPlayers_answer());
            gameQuestion.setCorrectAnswer(dto.getCorrect_answer());
            gameQuestion.setIsCorrect(dto.getIs_correct());
            gameQuestion.setDifficulty(dto.getDifficulty());
            gameQuestion.setScore(dto.getScore());

            // Parse the answered_at timestamp
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime answeredAt = LocalDateTime.parse(dto.getAnswered_at(), formatter);
            gameQuestion.setAnsweredAt(answeredAt);

            // Save to the database
            gameQuestionRepository.save(gameQuestion);
        }

        return ResponseEntity.ok("Scores saved successfully!");
    }

    @GetMapping("/topscores")
    public ResponseEntity<List<ScoresDto>> scoreBoard() {
        Pageable limit = PageRequest.of(0, 10);
        List<ScoresDto> response = gameQuestionRepository.getScoreBoard(limit);
        return ResponseEntity.ok(response);
    }


}
