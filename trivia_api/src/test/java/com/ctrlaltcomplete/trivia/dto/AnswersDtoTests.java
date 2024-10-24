package com.ctrlaltcomplete.trivia.dto;

import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class AnswersDtoTests {

    private AnswersDto answersDto;

    @BeforeEach
    public void setUp() {
        answersDto = new AnswersDto();
        answersDto.setQuestion_id(1L);
        answersDto.setPlayer_id(2L);
        answersDto.setPlayers_answer("My Answer");
        answersDto.setCorrect_answer("Correct Answer");
        answersDto.setIs_correct(true);
        answersDto.setDifficulty("Hard");
        answersDto.setScore(5L);
        answersDto.setAnswered_at("2023-10-10T14:30:00");
    }

    @Test
    public void createNewAnswersDto() {// Test initial vales are correctly set in setUp()
        assertEquals(answersDto.getQuestion_id(), 1L, "question_id is 1L");
        assertEquals(answersDto.getPlayer_id(), 2L, "player_id is 2L");
        assertEquals(answersDto.getPlayers_answer(), "My Answer", "players_answer is 'My Answer'");
        assertEquals(answersDto.getCorrect_answer(), "Correct Answer", "correct_answer should be 'Correct Answer'");
        assertTrue(answersDto.getIs_correct(), "is_correct is true");
        assertEquals(answersDto.getDifficulty(), "Hard", "difficulty set to 'Hard'");
        assertEquals(answersDto.getScore(), 5L, "score is 5L");
        assertEquals(answersDto.getAnswered_at(), "2023-10-10T14:30:00", "answered_at should be '2023-10-10T14:30:00'");
    }

    @Test
    public void testingSettersAnswersDto() { // Test setters
        AnswersDto updatedAnswersDto = new AnswersDto();
        updatedAnswersDto.setQuestion_id(10L);
        updatedAnswersDto.setPlayer_id(20L);
        updatedAnswersDto.setPlayers_answer("Updated Answer");
        updatedAnswersDto.setCorrect_answer("Updated Correct Answer");
        updatedAnswersDto.setIs_correct(false);
        updatedAnswersDto.setDifficulty("Medium");
        updatedAnswersDto.setScore(15L);
        updatedAnswersDto.setAnswered_at("2024-01-01T12:00:00");

        assertEquals(updatedAnswersDto.getQuestion_id(), 10L, "question_id should be 10L");
        assertEquals(updatedAnswersDto.getPlayer_id(), 20L, "player_id is 20L");
        assertEquals(updatedAnswersDto.getPlayers_answer(), "Updated Answer", "players_answer is 'Updated Answer'");
        assertEquals(updatedAnswersDto.getCorrect_answer(), "Updated Correct Answer", "correct_answer is 'Updated Correct Answer'");
        assertFalse(updatedAnswersDto.getIs_correct(), "is_correct is false");
        assertEquals(updatedAnswersDto.getDifficulty(), "Medium", "difficulty should be 'Medium'");
        assertEquals(updatedAnswersDto.getScore(), 15L, "score should be 15L");
        assertEquals(updatedAnswersDto.getAnswered_at(), "2024-01-01T12:00:00", "answered_at should be '2024-01-01T12:00:00'");
    }

    @Test
    public void testBoundaryValuesAnswersDto() {   // Test extreme boundary values for fields with numbers
        AnswersDto boundaryValuesDto = new AnswersDto();
        boundaryValuesDto.setScore(Long.MAX_VALUE);
        assertEquals(Long.MAX_VALUE, boundaryValuesDto.getScore(), "score set to Long.MAX_VALUE");

        boundaryValuesDto.setScore(Long.MIN_VALUE);
        assertEquals(Long.MIN_VALUE, boundaryValuesDto.getScore(), "score is Long.MIN_VALUE");

        boundaryValuesDto.setQuestion_id(0L);
        assertEquals(0L, boundaryValuesDto.getQuestion_id(), "question_id should be 0L");
    }
}
