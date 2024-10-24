package com.ctrlaltcomplete.trivia.controller;

import com.ctrlaltcomplete.trivia.dto.AnswersDto;
import com.ctrlaltcomplete.trivia.dto.ScoresDto;
import com.ctrlaltcomplete.trivia.model.GameQuestion;
import com.ctrlaltcomplete.trivia.model.User;
import com.ctrlaltcomplete.trivia.repository.GameQuestionRepository;
import com.ctrlaltcomplete.trivia.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GameQuestionControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GameQuestionRepository gameQuestionRepository;

    @InjectMocks
    private GameQuestionController gameQuestionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSubmitScores_successful() {
        // Arrange
        User user = new User();
        user.setId(1L);

        AnswersDto answerDto = new AnswersDto();
        answerDto.setPlayer_id(1L);
        answerDto.setPlayers_answer("A");
        answerDto.setCorrect_answer("A");
        answerDto.setIs_correct(true);
        answerDto.setDifficulty("medium");
        answerDto.setScore(100L);
        answerDto.setAnswered_at("2024-10-23T12:00:00");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<String> response = gameQuestionController.submitScores(Arrays.asList(answerDto));

        // Assert
        verify(gameQuestionRepository, times(1)).save(any(GameQuestion.class));
        assertEquals("Scores saved successfully!", response.getBody());
    }

    @Test
    void testSubmitScores_userNotFound() {
        // Arrange
        AnswersDto answerDto = new AnswersDto();
        answerDto.setPlayer_id(999L);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gameQuestionController.submitScores(Arrays.asList(answerDto));
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testScoreBoard() {
        // Arrange
        Pageable limit = PageRequest.of(0, 10);
        ScoresDto scoresDto = new ScoresDto();
        scoresDto.setFullName("player1");
        scoresDto.setTotalScore(200L);

        List<ScoresDto> mockScores = Arrays.asList(scoresDto);

        when(gameQuestionRepository.getScoreBoard(limit)).thenReturn(mockScores);

        // Act
        ResponseEntity<List<ScoresDto>> response = gameQuestionController.scoreBoard();

        // Assert
        assertEquals(200L, response.getBody().get(0).getTotalScore());
        assertEquals("player1", response.getBody().get(0).getFullName());
    }
}