package com.ctrlaltcomplete.trivia.model;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

//@SpringBootTest
public class GameQuestionTests {

    private static GameQuestion testGameQuestion;

    @BeforeEach
    public void setUp() {
        testGameQuestion = new GameQuestion();
        testGameQuestion.setUser(new User());
        testGameQuestion.setGame(new Game());
        testGameQuestion.setDifficulty("Medium");
        testGameQuestion.setCorrectAnswer("Dough");
        testGameQuestion.setIsCorrect(Boolean.TRUE);
        testGameQuestion.setScore(2L);
    }


//    id BIGSERIAL PRIMARY KEY,
//    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
//    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
//    trivia_id BIGINT,
//    answer TEXT,
//    correct_answer TEXT,
//    is_correct BOOLEAN,
//    difficulty TEXT,
//    score BIGINT,
//    answered_at TIMESTAMP DEFAULT NOW()



    @Test
    public void GameQuestionCreated() {
        assertEquals(testGameQuestion.getDifficulty(), "Medium");
        assertEquals(testGameQuestion.getCorrectAnswer(), "Dough");
        assertEquals(testGameQuestion.getIsCorrect(), Boolean.TRUE);
        assertEquals(testGameQuestion.getScore(),2L);
    }
}
